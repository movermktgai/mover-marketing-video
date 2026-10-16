import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

type SlackAppManifest = {
	display_information: {
		name: string;
		description: string;
		background_color: string;
	};
	features: {
		unfurl_domains: string[];
	};
	oauth_config: {
		redirect_urls: string[];
		scopes: {
			bot: string[];
		};
	};
	settings: {
		event_subscriptions: {
			request_url: string;
			bot_events: string[];
		};
	};
};

describe("Slack app manifest", () => {
	it("declares the complete and minimal video unfurl contract", () => {
		const manifest = JSON.parse(
			readFileSync(join(process.cwd(), "slack-app-manifest.json"), "utf8"),
		) as SlackAppManifest;

		expect(manifest.display_information).toMatchObject({
			name: "Mover Marketing Video",
			description: "Use Mover Marketing Video directly inside Slack.",
			background_color: "#0066FF",
		});
		expect(manifest.features.unfurl_domains).toEqual([
			"video.example.com",
		]);
		expect(manifest.oauth_config.scopes.bot).toEqual([
			"links:read",
			"links:write",
			"links.embed:write",
		]);
		expect(manifest.oauth_config.redirect_urls).toEqual([
			"https://video.example.com/api/integrations/slack/callback",
		]);
		expect(manifest.settings.event_subscriptions).toEqual({
			request_url:
				"https://video.example.com/api/integrations/slack/events",
			bot_events: ["link_shared", "app_uninstalled"],
		});
	});

	it("removes encrypted Slack credentials before deleting an organization", () => {
		const source = readFileSync(
			join(
				process.cwd(),
				"../../packages/web-backend/src/Organisations/index.ts",
			),
			"utf8",
		);
		const integrationDelete = source.indexOf(
			".delete(Db.integrationInstallations)",
		);
		const organizationDelete = source.indexOf(".delete(Db.organizations)");

		expect(integrationDelete).toBeGreaterThan(-1);
		expect(organizationDelete).toBeGreaterThan(integrationDelete);
	});
});
