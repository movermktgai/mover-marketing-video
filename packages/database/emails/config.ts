import { createHash } from "node:crypto";
import { buildEnv, serverEnv } from "@cap/env";
import type { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";

export const resend = () =>
	serverEnv().RESEND_API_KEY ? new Resend(serverEnv().RESEND_API_KEY) : null;

export const sendLoopsTransactionalEmail = async ({
	email,
	dataVariables,
	idempotencyKey,
}: {
	email: string;
	dataVariables: Record<string, string | number | boolean | null | undefined>;
	idempotencyKey?: string;
}) => {
	const env = serverEnv();
	if (!env.LOOPS_API_KEY || !env.LOOPS_LOGIN_TRANSACTIONAL_ID) {
		return false;
	}

	const requestKey = createHash("sha256")
		.update(idempotencyKey ?? `${email}:${JSON.stringify(dataVariables)}`)
		.digest("hex");

	const response = await fetch("https://app.loops.so/api/v1/transactional", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${env.LOOPS_API_KEY}`,
			"Content-Type": "application/json",
			"Idempotency-Key": requestKey,
		},
		body: JSON.stringify({
			email,
			transactionalId: env.LOOPS_LOGIN_TRANSACTIONAL_ID,
			addToAudience: false,
			dataVariables,
		}),
	});

	if (!response.ok) {
		throw new Error(`Loops transactional email failed: ${response.status}`);
	}

	return true;
};

export const sendEmail = async ({
	email,
	subject,
	react,
	marketing,
	test,
	scheduledAt,
	cc,
	replyTo,
	fromOverride,
}: {
	email: string;
	subject: string;
	react: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
	marketing?: boolean;
	test?: boolean;
	scheduledAt?: string;
	cc?: string | string[];
	replyTo?: string;
	fromOverride?: string;
}) => {
	const r = resend();
	if (!r) return;

	if (marketing && !buildEnv.NEXT_PUBLIC_IS_CAP) return;
	const from = fromOverride
		? fromOverride
		: marketing
			? "Richie from Cap <richie@send.cap.so>"
			: buildEnv.NEXT_PUBLIC_IS_CAP
				? "Cap Auth <no-reply@auth.cap.so>"
				: `auth@${serverEnv().RESEND_FROM_DOMAIN}`;

	return r.emails.send({
		from,
		to: test ? "delivered@resend.dev" : email,
		subject,
		react,
		scheduledAt,
		cc: test ? undefined : cc,
		replyTo: replyTo,
	});
};
