import "@/app/globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import type { PropsWithChildren } from "react";

const defaultFont = localFont({
	src: [
		{
			path: "../public/fonts/NeueMontreal-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/NeueMontreal-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/NeueMontreal-Italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/NeueMontreal-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
	],
	preload: false,
});

const APP_NAME = "Mover Marketing Video";
const APP_TAGLINE = "Screen recording for MMAI";
const APP_DESCRIPTION =
	"White-labeled screen recording and async video sharing for Mover Marketing AI.";
const APP_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";
const APP_OG_IMAGE = `${APP_URL}/og.png`;
const APP_COLOR = "#0066FF";
const APP_TILE_COLOR = "#0B1220";

export const metadata: Metadata = {
	metadataBase: new URL(APP_URL),
	title: `${APP_NAME} — ${APP_TAGLINE}`,
	description: APP_DESCRIPTION,
	openGraph: {
		title: `${APP_NAME} — ${APP_TAGLINE}`,
		description: APP_DESCRIPTION,
		type: "website",
		url: APP_URL,
		images: [APP_OG_IMAGE],
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html className={defaultFont.className} lang="en">
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color={APP_COLOR} />
				<link rel="shortcut icon" href="/favicon.ico" />
				<meta name="msapplication-TileColor" content={APP_TILE_COLOR} />
				<meta name="theme-color" content={APP_COLOR} />
			</head>
			<body suppressHydrationWarning>
				<Script src="/theme-script.js" strategy="beforeInteractive" />
				<main className="w-full">{children}</main>
			</body>
		</html>
	);
}
