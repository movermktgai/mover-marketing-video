"use client";

import { Button } from "@cap/ui";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { toast } from "sonner";
import { useEffectMutation, useRpcClient } from "@/lib/EffectRuntime";
import { Base } from "./Base";

export function CustomDomainPage() {
	const router = useRouter();
	const rpc = useRpcClient();

	const customDomainMutation = useEffectMutation({
		mutationFn: () =>
			rpc.UserCompleteOnboardingStep({
				step: "customDomain",
				data: undefined,
			}),
		onSuccess: () => {
			startTransition(() => {
				router.push("/onboarding/invite-team");
				router.refresh();
			});
		},
		onError: () => {
			toast.error("An error occurred, please try again");
		},
	});

	const handleSubmit = () => customDomainMutation.mutateAsync();

	return (
		<Base
			title="Custom domain"
			description={
				<div>
					<p className="w-full text-base max-w-[360px] text-gray-10">
						Custom domains are included for this self-hosted Mover Marketing
						Video build. You can configure them later from organization
						settings.
					</p>
				</div>
			}
			descriptionClassName="max-w-[420px]"
		>
			<Button
				type="button"
				variant="blue"
				spinner={customDomainMutation.isPending}
				disabled={customDomainMutation.isPending}
				className="mx-auto w-full"
				onClick={handleSubmit}
			>
				Continue
			</Button>
		</Base>
	);
}
