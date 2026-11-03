import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	timeout: 60_000,
	expect: {
		timeout: 15_000,
	},
	// Anything on the default fixture gets the system Google Chrome with its
	// sandbox on. The extension specs are the exception: they launch their own
	// Chromium context, since branded Chrome cannot load an unpacked extension.
	use: {
		channel: "chrome",
		launchOptions: { chromiumSandbox: !process.env.CI },
	},
	reporter: [["list"]],
});
