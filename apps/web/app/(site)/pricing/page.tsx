import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Mover Marketing Video",
};

export default function PricingRedirect() {
	redirect("/login");
}
