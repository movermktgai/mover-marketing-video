"use client";

import { ReadyToGetStarted } from "@/components/ReadyToGetStarted";
import { TextReveal } from "@/components/ui/TextReveal";
import { homepageCopy } from "../../../data/homepage-copy";
import Features from "./Features";
import InstantModeDetail from "./InstantModeDetail";
import RecordingModePicker from "./RecordingModePicker";
import ScreenshotModeDetail from "./ScreenshotModeDetail";
import StudioModeDetail from "./StudioModeDetail";
import Testimonials from "./Testimonials";

export function DeferredHomepageSections() {
	return (
		<div className="space-y-20 sm:space-y-[120px] lg:space-y-[180px]">
			<RecordingModePicker />
			<InstantModeDetail />
			<StudioModeDetail />
			<ScreenshotModeDetail />
			<Features />
			<Testimonials />
		</div>
	);
}

export function DeferredHomepageClosingSections() {
	return (
		<>
			<TextReveal className="max-w-[600px] mx-auto leading-[1.2] text-center">
				{homepageCopy.textReveal}
			</TextReveal>
			<ReadyToGetStarted />
		</>
	);
}
