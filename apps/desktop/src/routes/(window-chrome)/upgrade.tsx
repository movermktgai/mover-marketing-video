import { Button } from "@cap/ui-solid";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function Page() {
	return (
		<div class="flex justify-center items-center p-8 w-full h-screen text-center bg-gray-1">
			<div class="flex flex-col gap-4 items-center p-8 max-w-md rounded-3xl border bg-gray-2 border-gray-4">
				<h2 class="text-2xl font-bold text-gray-12">
					Mover Marketing Video is ready
				</h2>
				<p class="text-sm leading-6 text-gray-10">
					Paid Cap subscriptions are disabled for this self-hosted build. Long
					recordings, sharing, teams, and workspace features are included.
				</p>
				<Button variant="blue" onClick={() => getCurrentWindow().close()}>
					Done
				</Button>
			</div>
		</div>
	);
}
