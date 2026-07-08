// biome-ignore-all lint/security/noDangerouslySetInnerHtml: Static JSON-LD structured data is generated from local literals.
import type { Metadata } from "next";
import Script from "next/script";
import { AgenciesPage } from "@/components/pages/seo/AgenciesPage";

const PAGE_TITLE =
	"Cap for Agencies — Faster Client Updates with Instant Video Links";
const PAGE_DESCRIPTION =
	"Send clearer client updates in minutes. Share instant links with comments, or craft polished walkthroughs. Cap for Agencies on macOS & Windows.";
const APP_URL = (
	process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000"
).replace(/\/$/, "");
const PAGE_URL = `${APP_URL}/solutions/agencies`;
const PAGE_OG_IMAGE = `${APP_URL}/og.png`;

// Create FAQ structured data for SEO
const createFaqStructuredData = () => {
	const faqs = [
		{
			question: "Does Cap work on both macOS and Windows?",
			answer:
				"Yes. Cap supports both macOS and Windows with desktop apps, so your entire team can use the same workflow regardless of their platform preference.",
		},
		{
			question: "Can clients view videos without installing anything?",
			answer:
				"Yes. Clients can watch videos directly in their browser through a simple link. No downloads, no account creation, no friction. They can also leave comments directly on the video.",
		},
		{
			question: "What's the difference between Instant Mode and Studio Mode?",
			answer:
				"Instant Mode generates a shareable link immediately after recording—perfect for quick updates. Studio Mode records locally for the highest quality and includes precision editing tools for professional client presentations.",
		},
		{
			question: "How long can approved users record?",
			answer:
				"Mover Marketing Video treats approved self-hosted accounts as upgraded, so long recordings are included. Final length should still be validated against the desktop build and upload path.",
		},
		{
			question: "Is Cap secure enough for confidential client work?",
			answer:
				"Yes. Cap is open-source and privacy-first. You can connect your own S3 storage, use a custom domain for share links, and password-protect sensitive videos. This gives you complete control over client data.",
		},
		{
			question: "Can we use our own branding?",
			answer:
				"Yes. Mover Marketing Video is branded for Mover Marketing AI and serves share links from the configured self-hosted app domain. Custom storage and domain controls are handled through the configured self-hosted stack.",
		},
		{
			question: "How does access work for agency teams?",
			answer:
				"Paid Cap subscriptions are disabled for this self-hosted build. Approved Mover Marketing AI accounts have recording, sharing, and workspace collaboration included.",
		},
	];

	const faqStructuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer.replace(/<\/?[^>]+(>|$)/g, ""),
			},
		})),
	};

	return JSON.stringify(faqStructuredData);
};

// Create SoftwareApplication structured data
const createSoftwareStructuredData = () => {
	const softwareStructuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Cap — Screen Recorder",
		operatingSystem: ["macOS", "Windows"],
		applicationCategory: "BusinessApplication",
		description:
			"Open-source, privacy-first screen recorder for agencies. Instant share links and studio-quality local recording with editing.",
		publisher: {
			"@type": "Organization",
			name: "Cap",
		},
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
			category: "FreeTrial",
		},
	};

	return JSON.stringify(softwareStructuredData);
};

export const metadata: Metadata = {
	title: PAGE_TITLE,
	description: PAGE_DESCRIPTION,
	openGraph: {
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		url: PAGE_URL,
		siteName: "Cap",
		images: [
			{
				url: PAGE_OG_IMAGE,
				width: 1200,
				height: 630,
				alt: "Cap for Agencies",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: PAGE_TITLE,
		description: PAGE_DESCRIPTION,
		images: [PAGE_OG_IMAGE],
	},
	alternates: {
		canonical: PAGE_URL,
	},
};

export default function Page() {
	return (
		<>
			{/* biome-ignore lint: static JSON-LD scripts need stable ids and inline JSON content. */}
			<Script
				id="faq-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: createFaqStructuredData() }}
			/>
			{/* biome-ignore lint: static JSON-LD scripts need stable ids and inline JSON content. */}
			<Script
				id="software-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: createSoftwareStructuredData() }}
			/>
			<AgenciesPage />
		</>
	);
}
