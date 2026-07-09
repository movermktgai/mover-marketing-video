import { buildEnv } from "@cap/env";
import { provideOptionalAuth, Videos } from "@cap/web-backend";
import { Video } from "@cap/web-domain";
import { Effect, Option } from "effect";
import { type NextRequest, NextResponse } from "next/server";
import { runPromise } from "@/lib/server";

export const dynamic = "force-dynamic";

const PRODUCT_NAME = "Mover Marketing Video";
const VIDEO_ID_PATTERN = /^[0-9abcdefghjkmnpqrstvwxyz]{15}$/;

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Accept",
	"Access-Control-Max-Age": "86400",
	Vary: "Origin",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
	const response = NextResponse.json(body, init);
	for (const [key, value] of Object.entries(corsHeaders)) {
		response.headers.set(key, value);
	}
	return response;
}

function emptyResponse(status: number) {
	return new NextResponse(null, { status, headers: corsHeaders });
}

function absoluteAppUrl(pathname: string) {
	return new URL(pathname, buildEnv.NEXT_PUBLIC_WEB_URL).toString();
}

export async function OPTIONS() {
	return emptyResponse(204);
}

export async function GET(request: NextRequest) {
	const rawVideoId = request.nextUrl.searchParams.get("videoId")?.trim();

	if (!rawVideoId || !VIDEO_ID_PATTERN.test(rawVideoId)) {
		return jsonResponse({ error: "Invalid videoId" }, { status: 400 });
	}

	const videoId = Video.VideoId.make(rawVideoId);

	try {
		const payload = await Effect.gen(function* () {
			const videos = yield* Videos;
			const maybeVideo = yield* videos.getByIdForViewing(videoId);

			if (Option.isNone(maybeVideo)) return null;

			const [video] = maybeVideo.value;
			const shareUrl = absoluteAppUrl(`/s/${video.id}`);
			const previewImageUrl = absoluteAppUrl(
				`/api/video/preview?videoId=${video.id}&fallback=og`,
			);
			const fallbackImageUrl = absoluteAppUrl(
				`/api/video/og?videoId=${video.id}`,
			);

			return {
				productName: PRODUCT_NAME,
				videoId: video.id,
				title: video.name || "Untitled video",
				durationSeconds: video.duration ?? null,
				shareUrl,
				previewImageUrl,
				fallbackImageUrl,
			};
		}).pipe(provideOptionalAuth, runPromise);

		if (!payload) {
			return jsonResponse({ error: "Video not found" }, { status: 404 });
		}

		return jsonResponse(payload, {
			headers: {
				"Cache-Control": "public, max-age=60, stale-while-revalidate=300",
			},
		});
	} catch (error) {
		console.warn("[video/share-card] Failed to resolve share metadata:", error);
		return jsonResponse({ error: "Video unavailable" }, { status: 403 });
	}
}

export const HEAD = GET;
