"use client";

import { Button } from "@cap/ui";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "sonner";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { Base } from "./Base";

export function InviteTeamPage() {
	const router = useRouter();
	const rpc = useRpcClient();

	const inviteTeamMutation = useEffectMutation({
		mutationFn: () =>
			rpc.UserCompleteOnboardingStep({
				step: "inviteTeam",
				data: undefined,
			}),
		onSuccess: () => {
			startTransition(() => {
				router.push("/onboarding/download");
				router.refresh();
			});
		},
		onError: () => {
			toast.error("An error occurred, please try again");
		},
	});

	const handleSubmit = () => inviteTeamMutation.mutateAsync();

	return (
		<Base
			title="Invite your team"
			descriptionClassName="max-w-[420px]"
			description="Workspace collaboration is included for approved Mover Marketing AI accounts. You can add members from organization settings after setup."
		>
			<div className="rounded-2xl border border-gray-4 bg-gray-3 p-5 text-center text-sm leading-6 text-gray-10">
				No Cap Pro or Teams checkout is required for this self-hosted build.
				Continue setup now, then add teammates when you are ready.
			</div>
			<Button
				className="w-full"
				variant="blue"
				spinner={inviteTeamMutation.isPending}
				disabled={inviteTeamMutation.isPending}
				onClick={handleSubmit}
			>
				Continue
			</Button>
		</Base>
	);
}
