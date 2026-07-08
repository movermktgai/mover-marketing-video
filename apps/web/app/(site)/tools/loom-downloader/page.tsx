import type { Metadata } from "next";
import { LoomDownloader } from "@/components/tools/LoomDownloader";
import { ToolsPageTemplate } from "@/components/tools/ToolsPageTemplate";
import type { ToolPageContent } from "@/components/tools/types";
import { createBreadcrumbSchema } from "@/utils/web-schema";

const PUBLIC_APP_URL =
	process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
	title:
		"Loom Video Downloader — Download Loom Videos Free | Mover Marketing Video",
	description:
		"Download public Loom videos as MP4 files, then move approved recordings into the Mover Marketing Video workflow when needed.",
	keywords: [
		"loom video downloader",
		"download loom video",
		"loom downloader",
		"save loom video",
		"loom video download free",
		"loom to mp4",
		"download loom recording",
		"loom video saver",
		"free loom downloader",
		"loom download tool",
		"import loom videos",
		"loom video importer",
		"migrate from loom",
		"loom to cap migration",
		"loom alternative",
		"switch from loom",
	],
	openGraph: {
		title: "Loom Video Downloader — Free Download",
		description:
			"Download public Loom videos as MP4 files, then move approved recordings into the Mover Marketing Video workflow when needed.",
		url: `${PUBLIC_APP_URL}/tools/loom-downloader`,
		siteName: "Mover Marketing Video",
		type: "website",
		images: [
			{
				url: "/og.png",
				width: 1200,
				height: 630,
				alt: "Mover Marketing Video — Free Loom Video Downloader",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Loom Video Downloader — Free Download",
		description:
			"Download public Loom videos as MP4 files for approved migration and archive workflows.",
		images: ["/og.png"],
	},
	alternates: {
		canonical: `${PUBLIC_APP_URL}/tools/loom-downloader`,
	},
};

const pageContent: ToolPageContent = {
	title: "Loom Video Downloader",
	description:
		"Download any public Loom video as an MP4 for approved archive, migration, or client review workflows.",
	featuresTitle: "Download Loom videos for approved migration workflows",
	featuresDescription:
		"Mover Marketing Video keeps the downloader simple: paste a public Loom URL, save the MP4, then add approved recordings to your team workflow when needed.",
	features: [
		{
			title: "Instant Downloads",
			description:
				"Paste a Loom link and get your MP4 in seconds. No waiting, no queues, no processing delays.",
		},
		{
			title: "No Account Required",
			description:
				"No signup, no login, no email. Just paste your Loom URL and download the video immediately.",
		},
		{
			title: "Simple Archive Workflow",
			description:
				"Save approved Loom recordings as MP4 files before migrating, editing, or sharing them through your team's video workflow.",
		},
		{
			title: "Bring Recordings Into Your Workflow",
			description:
				"Once a recording is downloaded, add it to Mover Marketing Video or your preferred storage workflow according to team policy.",
		},
		{
			title: "No Subscription Pitch",
			description:
				"Mover Marketing Video does not offer Cap Pro or Teams checkout. Approved team accounts use the self-hosted stack already configured for Mover Marketing AI.",
		},
		{
			title: "Open Source & Privacy-First",
			description:
				'Cap is the <a href="/">open source Loom alternative</a>. Bring your own S3 bucket, connect your own domain, and own 100% of your video data.',
		},
	],
	faqs: [
		{
			question: "How do I download a Loom video?",
			answer:
				'Paste the Loom video URL into the input above and click "Download Video". The MP4 file will start downloading automatically. You can find Loom URLs by clicking the share button on any Loom video.',
		},
		{
			question: "Is this Loom video downloader free?",
			answer:
				"Yes, 100% free with no limits. There's no signup required, no premium tier, and no cap on the number of videos you can download.",
		},
		{
			question: "Do I need a promo code or checkout?",
			answer:
				"No. Mover Marketing Video does not use Cap Pro promo codes or paid checkout for approved Mover Marketing AI accounts.",
		},
		{
			question: "Can I import all my Loom videos at once?",
			answer:
				"Use this tool for public Loom videos that need a direct MP4 download. For larger migrations, coordinate with the Mover Marketing AI team so storage, permissions, and client-data handling are correct.",
		},
		{
			question: "Why migrate from Loom?",
			answer:
				"Mover Marketing Video gives approved team members a branded recording and sharing workflow on self-hosted infrastructure, with links served from the configured app domain.",
		},
		{
			question: "Can I download private Loom videos?",
			answer:
				"No, this tool only works with publicly accessible Loom videos. If a video requires a password or is set to private, you'll need to ask the video creator to make it public or share the download directly.",
		},
		{
			question: "What video format are downloads in?",
			answer:
				"All Loom videos are downloaded in MP4 format, which is compatible with virtually every device, media player, and video editor.",
		},
		{
			question: "Do you store my downloaded videos?",
			answer:
				"No. The downloader resolves public Loom videos in your browser and saves the MP4 to your device. Follow team policy before uploading client recordings anywhere else.",
		},
		{
			question: "What is Mover Marketing Video?",
			answer:
				'Mover Marketing Video is Mover Marketing AI\'s branded screen recording and sharing app, based on the open-source Cap project. <a href="/login">Open the dashboard</a>.',
		},
	],
	cta: {
		title: "Ready to save an approved Loom recording?",
		description:
			"Download the MP4, then add it to the right Mover Marketing AI workflow when it is approved for migration or sharing.",
		buttonText: "Open dashboard",
		buttonHref: "/login",
		secondaryButtonText: "Download app",
		secondaryButtonHref: "/download",
	},
};

const breadcrumbSchema = createBreadcrumbSchema([
	{ name: "Home", url: PUBLIC_APP_URL },
	{ name: "Tools", url: `${PUBLIC_APP_URL}/tools` },
	{
		name: "Loom Video Downloader",
		url: `${PUBLIC_APP_URL}/tools/loom-downloader`,
	},
]);

export default function LoomDownloaderPage() {
	return (
		<>
			<script type="application/ld+json">
				{JSON.stringify(breadcrumbSchema)}
			</script>
			<ToolsPageTemplate
				content={pageContent}
				toolComponent={<LoomDownloader />}
			/>
		</>
	);
}
