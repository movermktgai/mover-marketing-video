import { clientEnv } from "./env";

const CAP_CLOUD_HOSTS = new Set(["cap.so", "www.cap.so", "cap.link"]);

const serverHost = (() => {
	try {
		return new URL(clientEnv.VITE_SERVER_URL).hostname.toLowerCase();
	} catch {
		return "";
	}
})();

const isSelfHosted = !CAP_CLOUD_HOSTS.has(serverHost);

export const isSelfHostedServer = () => isSelfHosted;

const planIds = {
	development: {
		yearly: "price_1Q3esrFJxA1XpeSsFwp486RN",
		monthly: "price_1P9C1DFJxA1XpeSsTwwuddnq",
	},
	production: {
		yearly: "price_1S2al7FJxA1XpeSsJCI5Z2UD",
		monthly: "price_1S2akxFJxA1XpeSsfoAUUbpJ",
	},
};

export const getProPlanId = (billingCycle: "yearly" | "monthly") => {
	if (isSelfHostedServer()) return "";

	const environment =
		import.meta.env.VITE_ENVIRONMENT === "development"
			? "development"
			: "production";
	return planIds[environment]?.[billingCycle] || "";
};

export function isUserOnProPlan({
	subscriptionStatus,
}: {
	subscriptionStatus: string | null;
}): boolean {
	if (isSelfHostedServer()) return true;

	if (
		subscriptionStatus === "active" ||
		subscriptionStatus === "trialing" ||
		subscriptionStatus === "complete" ||
		subscriptionStatus === "paid"
	) {
		return true;
	}
	return false;
}
