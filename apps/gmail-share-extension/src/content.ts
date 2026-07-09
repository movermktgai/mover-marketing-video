type ExtensionSettings = {
	allowedOrigins: string[];
};

type ShareLinkMatch = {
	videoId: string;
	url: string;
	origin: string;
	rawText: string;
};

type ShareLinkMatchWithRange = ShareLinkMatch & {
	index: number;
};

type ShareCardMetadata = {
	productName: string;
	videoId: string;
	title: string;
	durationSeconds: number | null;
	shareUrl: string;
	previewImageUrl: string;
	fallbackImageUrl: string;
};

const PRODUCT_NAME = "Mover Marketing Video";
const DEFAULT_SETTINGS: ExtensionSettings = { allowedOrigins: [] };
const VIDEO_ID_PATTERN = /^[0-9abcdefghjkmnpqrstvwxyz]{15}$/i;
const SHARE_LINK_PATTERN =
	/https?:\/\/[^\s<>"']+\/s\/([0-9abcdefghjkmnpqrstvwxyz]{15})(?:[?#][^\s<>"']*)?/gi;
const GMAIL_EDITOR_SELECTOR = 'div[role="textbox"][contenteditable="true"]';
const CARD_SELECTOR = "[data-mmv-share-card]";

let settingsCache: ExtensionSettings | null = null;
const pendingTextNodes = new WeakSet<Text>();
const pendingElements = new WeakSet<Element>();
const processTimers = new WeakMap<HTMLElement, number>();

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName !== "sync" || !changes.allowedOrigins) return;
	settingsCache = null;
});

async function getSettings() {
	if (settingsCache) return settingsCache;
	const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
	const allowedOrigins = Array.isArray(stored.allowedOrigins)
		? stored.allowedOrigins.filter((origin): origin is string => {
				if (typeof origin !== "string") return false;
				try {
					const url = new URL(origin);
					return url.origin === origin;
				} catch {
					return false;
				}
			})
		: [];

	settingsCache = { allowedOrigins };
	return settingsCache;
}

function findEditor(target: EventTarget | null) {
	if (!(target instanceof Element)) return null;
	return target.closest<HTMLElement>(GMAIL_EDITOR_SELECTOR);
}

function dispatchEditorInput(editor: HTMLElement) {
	editor.dispatchEvent(
		new InputEvent("input", {
			bubbles: true,
			inputType: "insertHTML",
		}),
	);
}

function scheduleProcess(editor: HTMLElement) {
	const existingTimer = processTimers.get(editor);
	if (existingTimer) window.clearTimeout(existingTimer);

	const timer = window.setTimeout(() => {
		processTimers.delete(editor);
		processEditor(editor).catch((error) => {
			console.warn(
				"[Mover Marketing Video] Gmail card formatting failed",
				error,
			);
		});
	}, 150);

	processTimers.set(editor, timer);
}

function parseShareLink(rawValue: string): ShareLinkMatch | null {
	const trimmed = rawValue.trim().replace(/[),.;!?]+$/g, "");

	try {
		const url = new URL(trimmed);
		if (url.protocol !== "http:" && url.protocol !== "https:") return null;

		const segments = url.pathname.split("/").filter(Boolean);
		if (segments[0] !== "s") return null;

		const videoId = segments[1];
		if (!videoId || !VIDEO_ID_PATTERN.test(videoId)) return null;

		return {
			videoId,
			url: `${url.origin}/s/${videoId}`,
			origin: url.origin,
			rawText: rawValue,
		};
	} catch {
		return null;
	}
}

function findFirstShareLink(text: string): ShareLinkMatchWithRange | null {
	SHARE_LINK_PATTERN.lastIndex = 0;
	const match = SHARE_LINK_PATTERN.exec(text);
	if (!match) return null;

	const parsed = parseShareLink(match[0]);
	if (!parsed) return null;

	return {
		...parsed,
		index: match.index,
	};
}

function isAllowedOrigin(origin: string, settings: ExtensionSettings) {
	return (
		settings.allowedOrigins.length === 0 ||
		settings.allowedOrigins.includes(origin)
	);
}

async function fetchShareMetadata(match: ShareLinkMatch) {
	const settings = await getSettings();
	if (!isAllowedOrigin(match.origin, settings)) return null;

	const metadataUrl = new URL("/api/video/share-card", match.origin);
	metadataUrl.searchParams.set("videoId", match.videoId);

	const response = await fetch(metadataUrl.toString(), {
		credentials: "omit",
		headers: { Accept: "application/json" },
	});

	if (!response.ok) return null;

	const data = (await response.json()) as Partial<ShareCardMetadata>;
	if (
		data.productName !== PRODUCT_NAME ||
		data.videoId !== match.videoId ||
		typeof data.title !== "string" ||
		typeof data.shareUrl !== "string" ||
		typeof data.previewImageUrl !== "string" ||
		typeof data.fallbackImageUrl !== "string"
	) {
		return null;
	}

	return {
		productName: data.productName,
		videoId: data.videoId,
		title: data.title,
		durationSeconds:
			typeof data.durationSeconds === "number" ? data.durationSeconds : null,
		shareUrl: data.shareUrl,
		previewImageUrl: data.previewImageUrl,
		fallbackImageUrl: data.fallbackImageUrl,
	} satisfies ShareCardMetadata;
}

function formatDuration(durationSeconds: number | null) {
	if (
		!durationSeconds ||
		!Number.isFinite(durationSeconds) ||
		durationSeconds < 1
	) {
		return "Watch recording";
	}

	const totalSeconds = Math.round(durationSeconds);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	if (hours > 0) {
		return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
	}

	return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
	for (const [key, value] of Object.entries(styles)) {
		if (typeof value !== "string") continue;
		element.style.setProperty(
			key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
			value,
		);
	}
}

function createLink(href: string) {
	const link = document.createElement("a");
	link.href = href;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	return link;
}

function createShareCard(metadata: ShareCardMetadata) {
	const wrapper = document.createElement("span");
	wrapper.dataset.mmvShareCard = "true";
	wrapper.contentEditable = "false";
	setStyles(wrapper, {
		display: "block",
		maxWidth: "420px",
		margin: "12px 0",
	});

	const table = document.createElement("table");
	table.setAttribute("role", "presentation");
	table.cellPadding = "0";
	table.cellSpacing = "0";
	setStyles(table, {
		width: "100%",
		maxWidth: "420px",
		borderCollapse: "separate",
		borderSpacing: "0",
		border: "1px solid #d7dde8",
		borderRadius: "16px",
		backgroundColor: "#ffffff",
		fontFamily: "Arial, Helvetica, sans-serif",
		overflow: "hidden",
	});

	const imageRow = table.insertRow();
	const imageCell = imageRow.insertCell();
	imageCell.colSpan = 2;
	setStyles(imageCell, {
		padding: "0",
		backgroundColor: "#0b1220",
	});

	const imageLink = createLink(metadata.shareUrl);
	setStyles(imageLink, {
		display: "block",
		textDecoration: "none",
	});

	const image = document.createElement("img");
	image.src = metadata.previewImageUrl || metadata.fallbackImageUrl;
	image.alt = `Preview of ${metadata.title}`;
	image.width = 420;
	setStyles(image, {
		display: "block",
		width: "100%",
		maxWidth: "420px",
		height: "auto",
		border: "0",
	});
	imageLink.append(image);
	imageCell.append(imageLink);

	const bodyRow = table.insertRow();
	const bodyCell = bodyRow.insertCell();
	bodyCell.colSpan = 2;
	setStyles(bodyCell, {
		padding: "14px 16px 16px",
	});

	const titleLink = createLink(metadata.shareUrl);
	titleLink.textContent = metadata.title;
	setStyles(titleLink, {
		display: "block",
		margin: "0 0 8px",
		color: "#0b1220",
		fontSize: "16px",
		fontWeight: "700",
		lineHeight: "1.35",
		textDecoration: "none",
	});

	const meta = document.createElement("div");
	meta.textContent = `${formatDuration(metadata.durationSeconds)} · Watch video`;
	setStyles(meta, {
		color: "#526175",
		fontSize: "13px",
		lineHeight: "1.4",
	});

	const cta = createLink(metadata.shareUrl);
	cta.textContent = "Open in Mover Marketing Video";
	setStyles(cta, {
		display: "inline-block",
		marginTop: "12px",
		padding: "9px 14px",
		borderRadius: "999px",
		backgroundColor: "#0b1220",
		color: "#ffffff",
		fontSize: "13px",
		fontWeight: "700",
		textDecoration: "none",
	});

	bodyCell.append(titleLink, meta, cta);
	wrapper.append(table);
	return wrapper;
}

async function replaceAnchor(anchor: HTMLAnchorElement, match: ShareLinkMatch) {
	if (pendingElements.has(anchor) || anchor.closest(CARD_SELECTOR)) return;
	pendingElements.add(anchor);

	try {
		const metadata = await fetchShareMetadata(match);
		if (!metadata || !anchor.isConnected) return;

		const editor = anchor.closest<HTMLElement>(GMAIL_EDITOR_SELECTOR);
		const card = createShareCard(metadata);
		anchor.replaceWith(card);
		card.after(document.createElement("br"));
		if (editor) dispatchEditorInput(editor);
	} finally {
		pendingElements.delete(anchor);
	}
}

async function replaceTextNode(node: Text, match: ShareLinkMatchWithRange) {
	if (pendingTextNodes.has(node)) return;
	pendingTextNodes.add(node);

	try {
		const metadata = await fetchShareMetadata(match);
		if (!metadata || !node.isConnected || !node.nodeValue) return;

		const currentIndex = node.nodeValue.indexOf(match.rawText);
		if (currentIndex < 0) return;

		const editor = node.parentElement?.closest<HTMLElement>(
			GMAIL_EDITOR_SELECTOR,
		);
		const range = document.createRange();
		range.setStart(node, currentIndex);
		range.setEnd(node, currentIndex + match.rawText.length);
		range.deleteContents();

		const card = createShareCard(metadata);
		range.insertNode(card);
		card.after(document.createElement("br"));
		range.detach();
		if (editor) dispatchEditorInput(editor);
	} finally {
		pendingTextNodes.delete(node);
	}
}

async function processEditor(editor: HTMLElement) {
	const anchorPromises: Promise<void>[] = [];
	for (const anchor of editor.querySelectorAll<HTMLAnchorElement>("a[href]")) {
		if (anchor.closest(CARD_SELECTOR)) continue;
		const match = parseShareLink(anchor.href);
		if (!match) continue;
		anchorPromises.push(replaceAnchor(anchor, match));
	}

	const textNodes: Array<{
		node: Text;
		match: ShareLinkMatchWithRange;
	}> = [];
	const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			if (!(node instanceof Text) || !node.nodeValue?.includes("/s/")) {
				return NodeFilter.FILTER_REJECT;
			}

			const parent = node.parentElement;
			if (!parent || parent.closest(`${CARD_SELECTOR}, a`)) {
				return NodeFilter.FILTER_REJECT;
			}

			return NodeFilter.FILTER_ACCEPT;
		},
	});

	while (walker.nextNode()) {
		const node = walker.currentNode as Text;
		const match = findFirstShareLink(node.nodeValue || "");
		if (match) textNodes.push({ node, match });
	}

	await Promise.all([
		...anchorPromises,
		...textNodes.map(({ node, match }) => replaceTextNode(node, match)),
	]);
}

document.addEventListener(
	"paste",
	(event) => {
		const editor = findEditor(event.target);
		if (editor) scheduleProcess(editor);
	},
	true,
);

document.addEventListener(
	"input",
	(event) => {
		const editor = findEditor(event.target);
		if (editor) scheduleProcess(editor);
	},
	true,
);

const observer = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (!(node instanceof Element)) continue;
			const editor = node.matches(GMAIL_EDITOR_SELECTOR)
				? (node as HTMLElement)
				: node.querySelector<HTMLElement>(GMAIL_EDITOR_SELECTOR);
			if (editor) scheduleProcess(editor);
		}
	}
});

observer.observe(document.documentElement, {
	childList: true,
	subtree: true,
});

for (const editor of document.querySelectorAll<HTMLElement>(
	GMAIL_EDITOR_SELECTOR,
)) {
	scheduleProcess(editor);
}
