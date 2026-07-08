import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadataBySlug } from "@/lib/seo-metadata";
import { getPageBySlug } from "@/lib/seo-pages";

type Props = {
	params: Promise<{ slug: string }>;
};

const SITE_NAME = "Mover Marketing Video";
const SITE_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export async function generateMetadata(props: Props): Promise<Metadata> {
	const params = await props.params;
	const metadata = getMetadataBySlug(params.slug);

	if (!metadata) {
		return {
			title: `${SITE_NAME} — Screen recording for MMAI.`,
			description:
				"Mover Marketing Video helps Mover Marketing AI record, share, and review videos quickly.",
		};
	}

	return {
		title: metadata.title,
		description: metadata.description,
		keywords: metadata.keywords,
		alternates: {
			canonical: `${SITE_URL}/${params.slug}`,
		},
		openGraph: {
			title: metadata.title,
			description: metadata.description,
			url: `${SITE_URL}/${params.slug}`,
			images: [metadata.ogImage],
		},
	};
}

export default async function SeoPage(props: Props) {
	const params = await props.params;
	const page = getPageBySlug(params.slug);

	if (!page) {
		notFound();
	}

	const PageComponent = page.component;
	return <PageComponent />;
}
