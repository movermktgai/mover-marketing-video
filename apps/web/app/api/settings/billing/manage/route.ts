import { NextResponse } from "next/server";

const BILLING_DISABLED_MESSAGE =
	"Paid subscriptions are disabled for Mover Marketing Video.";

const billingDisabledResponse = () =>
	NextResponse.json({ error: BILLING_DISABLED_MESSAGE }, { status: 404 });

export async function GET() {
	return billingDisabledResponse();
}

export async function POST() {
	return billingDisabledResponse();
}
