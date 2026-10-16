import type { Metadata } from "next";
import { signOgParams } from "@/lib/og/signature";

export type OgImageParams = {
	title: string;
	tag?: string;
	description?: string;
};

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const isCapHosted = () => process.env.NEXT_PUBLIC_IS_CAP === "true";

export const ogImageUrl = ({ title, tag, description }: OgImageParams) => {
	if (!isCapHosted()) return "/og.png";

	const params = new URLSearchParams({ title });
	if (tag) params.set("tag", tag);
	if (description) params.set("description", description);
	params.set("s", signOgParams({ title, tag, description }));
	return `/api/og?${params.toString()}`;
};

type MarketingMetadataParams = {
	title: string;
	description?: string;
	path?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogTag?: string;
};

export const buildMarketingMetadata = ({
	title,
	description,
	path,
	ogTitle,
	ogDescription,
	ogTag,
}: MarketingMetadataParams): Metadata => {
	const imageTitle = ogTitle ?? title;
	const image = {
		url: ogImageUrl({
			title: imageTitle,
			tag: ogTag,
			description: ogDescription ?? description,
		}),
		width: OG_IMAGE_WIDTH,
		height: OG_IMAGE_HEIGHT,
		alt: imageTitle,
	};

	return {
		title,
		description,
		...(path && { alternates: { canonical: path } }),
		openGraph: {
			title,
			description,
			type: "website",
			...(path && { url: path }),
			siteName: isCapHosted() ? "Cap" : "Mover Marketing Video",
			images: [image],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image.url],
		},
	};
};
