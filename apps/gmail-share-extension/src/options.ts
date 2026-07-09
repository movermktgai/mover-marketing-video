import "./options.css";

type ExtensionSettings = {
	allowedOrigins: string[];
};

const DEFAULT_SETTINGS: ExtensionSettings = {
	allowedOrigins: [],
};

function normalizeOrigins(rawOrigins: unknown) {
	if (!Array.isArray(rawOrigins)) return [];

	const dedupedOrigins = new Set<string>();
	for (const origin of rawOrigins) {
		if (typeof origin !== "string") continue;
		const normalizedOrigin = normalizeOrigin(origin);
		if (!normalizedOrigin) continue;
		dedupedOrigins.add(normalizedOrigin);
	}

	return [...dedupedOrigins];
}

const textarea =
	document.querySelector<HTMLTextAreaElement>("#allowed-origins");
const saveButton = document.querySelector<HTMLButtonElement>("#save");
const status = document.querySelector<HTMLSpanElement>("#status");

function normalizeOrigin(value: string) {
	try {
		const url = new URL(value.trim());
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;
		return url.origin;
	} catch {
		return null;
	}
}

function setStatus(message: string) {
	if (!status) return;
	status.textContent = message;
	window.setTimeout(() => {
		if (status.textContent === message) status.textContent = "";
	}, 3000);
}

async function loadSettings() {
	const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
	const allowedOrigins = normalizeOrigins(stored.allowedOrigins);
	if (textarea) textarea.value = allowedOrigins.join("\n");
}

async function saveSettings() {
	if (!textarea) return;

	const allowedOrigins = normalizeOrigins(textarea.value.split("\n"));

	await chrome.storage.sync.set({ allowedOrigins });
	textarea.value = allowedOrigins.join("\n");
	setStatus("Saved");
}

saveButton?.addEventListener("click", () => {
	saveSettings().catch((error) => {
		console.error("Failed to save settings", error);
		setStatus("Could not save settings");
	});
});

loadSettings().catch((error) => {
	console.error("Failed to load settings", error);
	setStatus("Could not load settings");
});
