import { User } from "@cap/web-domain";
import { eq, type InferSelectModel } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { cache } from "react";
import { db } from "../";
import { users } from "../schema";
import { authOptions } from "./auth-options";

export const getSession = cache(() => getServerSession(authOptions()));

export const getCurrentUser = cache(
	async (): Promise<InferSelectModel<typeof users> | null> => {
		const session = await getSession();

		if (!session) return null;

		const [currentUser] = await db()
			.select()
			.from(users)
			.where(eq(users.id, User.UserId.make(session.user.id)));

		return currentUser ?? null;
	},
);

export const userSelectProps = users.$inferSelect;
