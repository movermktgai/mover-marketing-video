import { describe, expect, it } from "vitest";
import { PRICING } from "@/data/pricing";

describe("PRICING", () => {
	it("matches the published parity price points", () => {
		expect(PRICING.pro.monthly).toBe(12);
		expect(PRICING.pro.yearlyTotal).toBe(98);
		expect(PRICING.commercial.yearly).toBe(29);
		expect(PRICING.commercial.lifetime).toBe(58);
	});

	it("derives the annual per-month figure from the yearly total", () => {
		const truncatedToCents =
			Math.floor((PRICING.pro.yearlyTotal / 12) * 100) / 100;
		expect(PRICING.pro.annualPerMonth).toBe(truncatedToCents);
	});
});
