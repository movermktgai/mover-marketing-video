"use client";

import { Button, Dialog, DialogContent } from "@cap/ui";
import { memo } from "react";

interface UpgradeModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dismissible?: boolean;
}

const UpgradeModalImpl = ({
	open,
	onOpenChange,
	dismissible = true,
}: UpgradeModalProps) => {
	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen || dismissible) {
			onOpenChange(nextOpen);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				onEscapeKeyDown={(event) => {
					if (!dismissible) event.preventDefault();
				}}
				onInteractOutside={(event) => {
					if (!dismissible) event.preventDefault();
				}}
				className={[
					"w-[calc(100%-20px)] max-w-[520px] bg-gray-2 border border-gray-4 p-0 overflow-hidden",
					dismissible ? "" : "[&>button:last-child]:hidden",
				].join(" ")}
			>
				<div className="flex flex-col gap-4 p-7 text-center">
					<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
						✓
					</div>
					<div className="space-y-2">
						<h2 className="text-2xl font-semibold text-gray-12">
							Mover Marketing Video access is included
						</h2>
						<p className="text-sm leading-6 text-gray-10">
							Paid Cap subscriptions and checkout are disabled for this
							self-hosted build. Approved Mover Marketing AI accounts include
							recording, sharing, AI features where configured, and workspace
							collaboration.
						</p>
					</div>
					<Button variant="blue" onClick={() => onOpenChange(false)}>
						Done
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export const UpgradeModal = memo(UpgradeModalImpl);
export default UpgradeModal;
