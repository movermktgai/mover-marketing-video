export interface HeaderCopyVariants {
	default: {
		title: string;
		description: string;
	};
}

export interface HeaderCopy {
	announcement: {
		text: string;
		href: string;
	};
	variants: HeaderCopyVariants;
	modes: {
		id: "instant" | "studio" | "screenshot";
		label: string;
		title: string;
	}[];
	links: {
		label: string;
		href: string;
	}[];
	cta: {
		primaryButton: string;
		secondaryButton: string;
		freeVersionText: string;
		seeOtherOptionsText: string;
	};
}

export interface RecordingModesCopy {
	title: string;
	subtitle: string;
	modes: {
		name: string;
		description: string;
	}[];
}

export interface FeaturesCopy {
	title: string;
	subtitle: string;
	features: {
		title: string;
		description: string;
	}[];
}

export interface BentoCopy {
	eyebrow: string;
	title: string;
	subtitle: string;
	cards: {
		key: string;
		title: string;
		description: string;
	}[];
	cta: {
		label: string;
		href: string;
	};
}

export interface TestimonialsCopy {
	title: string;
	subtitle: string;
	cta: string;
}

export interface PricingCopy {
	title: string;
	subtitle: string;
	lovedBy: string;
	commercial: {
		title: string;
		description: string;
		features: string[];
		cta: string;
		pricing: {
			yearly: number;
			lifetime: number;
		};
		labels: {
			licenses: string;
			yearly: string;
			lifetime: string;
		};
	};
	pro: {
		badge: string;
		title: string;
		description: string;
		features: string[];
		cta: string;
		pricing: {
			annual: number;
			monthly: number;
		};
		labels: {
			users: string;
			monthly: string;
			annually: string;
		};
	};
}

export interface FaqCopy {
	title: string;
	items: {
		question: string;
		answer: string;
	}[];
}

export interface ReadyToGetStartedCopy {
	title: string;
	buttons: {
		primary: string;
		secondary: string;
	};
}

export interface HomePageCopy {
	header: HeaderCopy;
	textReveal: string;
	recordingModes: RecordingModesCopy;
	features: FeaturesCopy;
	bento: BentoCopy;
	testimonials: TestimonialsCopy;
	pricing: PricingCopy;
	faq: FaqCopy;
	readyToGetStarted: ReadyToGetStartedCopy;
}

export const homepageCopy: HomePageCopy = {
	header: {
		announcement: {
			text: "Early Adopter Pricing Ends Soon — Lock In Your Discount",
			href: "/pricing",
		},
		variants: {
			default: {
				title: "The only screen recording app you need",
				description:
					"Cap is the only screen recording tool you need — three modes in one app that replace your recorder, editor, screenshot tool, and video host. Fully open source, and you can connect your own Google Drive or S3 bucket, so you own every recording.",
			},
		},
		modes: [
			{
				id: "instant",
				label: "Instant",
				title: "Record and share in seconds",
			},
			{
				id: "studio",
				label: "Studio",
				title: "Record and edit locally",
			},
			{
				id: "screenshot",
				label: "Screenshot",
				title: "Capture, annotate and copy",
			},
		],
		links: [
			{ label: "Screen recordings", href: "/screen-recorder" },
			{ label: "Screenshots", href: "/features" },
			{ label: "Privacy", href: "/privacy" },
			{ label: "Open source", href: "/open-source-screen-recorder" },
		],
		cta: {
			primaryButton: "Open dashboard",
			secondaryButton: "View on GitHub",
			freeVersionText:
				"Approved Mover Marketing AI accounts can record, share, and collaborate without a Cap subscription checkout.",
			seeOtherOptionsText: "More download options",
		},
	},
	textReveal: "Record. Edit. Share.",
	recordingModes: {
		title: "Three Modes, Zero Compromise",
		subtitle:
			"Instant Mode uploads as you record, so a shareable link is ready the moment you stop. Studio Mode keeps everything local for pixel-perfect editing. Screenshot, when a single frame is enough.",
		modes: [
			{
				name: "Instant Mode",
				description:
					"Hit record, stop, share link. Your video is live in seconds with auto-generated captions, a title, summary, chapters, and more. Perfect for quick feedback, bug reports, or when you just need to show something fast.",
			},
			{
				name: "Studio Mode",
				description:
					"Professional recordings with local editing, custom backgrounds, and export options. When you need pixel-perfect demos, tutorials, or presentations that represent your brand.",
			},
		],
	},
	features: {
		title: "Built For How You Actually Work",
		subtitle:
			"We obsessed over the details so you don't have to. Every feature is designed to save you time and make you look good.",
		features: [
			{
				title: "Your Storage, Your Rules",
				description:
					"Connect your own Google Drive or S3 bucket, use Cap Cloud, or keep everything local. You're never locked into our infrastructure, perfect for teams with compliance requirements or anyone who values data sovereignty.",
			},
			{
				title: "Privacy by Default, Sharing by Choice",
				description:
					"Instant sharing when you need it, local recording when you want it. Share publicly or privately, password-protect sensitive recordings, or keep them local only.",
			},
			{
				title: "Async Collaboration That Actually Works",
				description:
					'Comments, reactions, and transcripts keep conversations moving without another meeting. See who watched, get notified on feedback, and turn recordings into actionable next steps. Replace those "quick sync" calls for good.',
			},
			{
				title: "Cross-Platform For Your Entire Team",
				description:
					"Native apps for macOS and Windows that feel at home on each platform, plus a Chrome extension when browser recording is the right fit. Fast, reliable recording that works with your existing tools and workflow.",
			},
			{
				title: "Quality That Makes You Look Professional",
				description:
					"4K recording, 60fps capture, and intelligent compression that keeps file sizes reasonable.",
			},
			{
				title: "Truly Open Source",
				description:
					"See exactly how Cap works, contribute features you need, or self-host for complete control. Join a community of builders who believe great tools should be transparent, extensible, and respect their users.",
			},
			{
				title: "Speed Up Your Workflow With Cap AI",
				description:
					"Auto-generated titles, summaries, clickable chapters, and transcriptions for every recording. AI features that actually save time instead of creating more work.",
			},
			{
				title: "Import Your Loom Videos",
				description:
					"Switching from Loom? Import your existing recordings directly into Cap with our built-in importer. Keep all your content in one place without starting from scratch.",
			},
		],
	},
	bento: {
		eyebrow: "Why Cap",
		title: "Built To Be Yours",
		subtitle:
			"Every feature respects how you actually work — your storage, your platform, your workflow. No vendor lock-in, no compromises.",
		cards: [
			{
				key: "storage",
				title: "Bring Your Own Storage",
				description:
					"Plug in your own Google Drive or S3 bucket, route to Cap Cloud, or keep recordings entirely local. Your videos, your storage, your bill, with no vendor lock-in, ever.",
			},
			{
				key: "ai",
				title: "Cap AI Does The Busywork",
				description:
					"Every recording gets an AI-generated title, summary, clickable chapters, and a fully searchable transcript — so the work after the recording is already done.",
			},
			{
				key: "async",
				title: "Async Conversations That Move",
				description:
					"Threaded comments, emoji reactions, and viewer analytics turn one-way videos into two-way conversations. Replace the standing meeting for good.",
			},
			{
				key: "native",
				title: "Native, Not An Electron Tab",
				description:
					"Built on Tauri and Rust for genuinely native performance on macOS and Windows. No bloated browser, no battery hit — just a fast, lightweight recorder.",
			},
			{
				key: "oss",
				title: "Open Source, End To End",
				description:
					"Inspect every line, contribute the feature you've been waiting for, or self-host the entire stack. Fair, transparent, and yours to fork.",
			},
			{
				key: "pixel",
				title: "Pixel-Perfect Capture",
				description:
					"Record up to 4K at 60fps with hardware-accelerated encoding. Crisp text, smooth motion, sane file sizes — the quality your work deserves.",
			},
		],
		cta: {
			label: "Explore Every Feature",
			href: "/features",
		},
	},
	testimonials: {
		title: "Loved By Builders, Trusted By Teams",
		subtitle:
			"Join thousands who've made Cap their daily driver for visual communication.",
		cta: "Read More Testimonials",
	},
	pricing: {
		title: "Included For Mover Marketing AI",
		subtitle:
			"This self-hosted build is configured for approved Mover Marketing AI accounts, with recording, sharing, and workspace collaboration included.",
		lovedBy: "Built for Mover Marketing AI teams",
		commercial: {
			title: "Desktop App",
			description:
				"The Mover Marketing Video desktop app includes commercial use for approved Mover Marketing AI work.",
			features: [
				"Commercial use for approved Mover Marketing AI work",
				"Unlimited local recordings and editing",
				"Studio Mode with full editor",
				"Shareable links through your configured app domain",
				"Export to common formats",
				"Internal team support",
			],
			cta: "Download Desktop App",
			pricing: {
				yearly: 0,
				lifetime: 0,
			},
			labels: {
				licenses: "License type",
				yearly: "Annual",
				lifetime: "One-time",
			},
		},
		pro: {
			badge: "Best value",
			title: "Workspace Features",
			description:
				"Recording, sharing, AI-assisted summaries, and collaboration are included for approved accounts.",
			features: [
				"Everything in the desktop app",
				"Cloud sharing through the Mover Marketing Video stack",
				"Auto-generated titles, summaries, chapters, and transcriptions where configured",
				"Custom domain support",
				"Password protected shares",
				"Viewer analytics and engagement signals",
				"Team workspaces",
				"Loom video importer where enabled",
				"Custom S3 bucket and Google Drive support where configured",
				"Internal support",
			],
			cta: "Open Dashboard",
			pricing: {
				annual: 0,
				monthly: 0,
			},
			labels: {
				users: "Per user",
				monthly: "Monthly",
				annually: "Annual (save 32%)",
			},
		},
	},
	faq: {
		title: "Questions? We've Got Answers.",
		items: [
			{
				question: "Do I need to buy Cap Pro or Teams?",
				answer:
					"No. This self-hosted Mover Marketing Video build includes recording, sharing, commercial use, and workspace collaboration for approved Mover Marketing AI accounts.",
			},
			{
				question: "Who can sign in?",
				answer:
					"Signups are restricted to approved Mover Marketing AI domains and users. If you need access, ask the Mover Marketing AI team to add or approve your account.",
			},
			{
				question: "How long can I record?",
				answer:
					"This self-hosted build treats approved accounts as upgraded, so long recordings are supported by the app and infrastructure. Final recording length should still be validated against the desktop build and upload path.",
			},
			{
				question: "How do AI features work?",
				answer:
					"AI-assisted titles, summaries, chapters, and transcripts run through the configured Mover Marketing Video backend services where those services are enabled.",
			},
			{
				question: "How is this different from Loom?",
				answer:
					"Mover Marketing Video gives the team a controlled recording and sharing stack for client work, with self-hosted infrastructure and branded links on the configured app domain.",
			},
			{
				question: "What happens to my recordings?",
				answer:
					"Recordings are stored through the configured Mover Marketing Video infrastructure and remain available according to Mover Marketing AI's internal storage and retention policies.",
			},
			{
				question: "Do you offer team workspaces?",
				answer:
					"Yes. Workspace collaboration is included for approved accounts, and team members can be managed from organization settings.",
			},
			{
				question: "Which platforms do you support?",
				answer:
					"Native desktop apps for macOS and Windows are supported by the upstream app. View shareable links from any modern browser.",
			},
			{
				question: "Can I use Mover Marketing Video for client work?",
				answer:
					"Yes. This self-hosted build is intended for approved Mover Marketing AI commercial work and does not require a separate Cap subscription checkout.",
			},
			{
				question: "Is my data secure?",
				answer:
					"Security depends on the configured Mover Marketing Video infrastructure, storage, and access controls. The fork remains based on open-source Cap code, so the implementation is auditable.",
			},
			{
				question: "What about compliance-sensitive recordings?",
				answer:
					"Mover Marketing Video uses self-hosted infrastructure and configured storage instead of a paid Cap Cloud subscription. Treat sensitive recordings according to Mover Marketing AI's client-data policies and storage controls.",
			},
		],
	},
	readyToGetStarted: {
		title: "Ready To Record And Share?",
		buttons: {
			primary: "Open Dashboard",
			secondary: "Download App",
		},
	},
};
