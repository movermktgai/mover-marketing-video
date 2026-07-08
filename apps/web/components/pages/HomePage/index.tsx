import {
	DeferredHomepageClosingSections,
	DeferredHomepageSections,
} from "./DeferredHomepageSections";
import Faq from "./Faq";
import Header from "./Header";
import { HomePageSchema } from "./HomePageSchema";

interface HomePageProps {
	serverHomepageCopyVariant?: string;
}

export function HomePage({ serverHomepageCopyVariant = "" }: HomePageProps) {
	return (
		<>
			<HomePageSchema />
			<Header serverHomepageCopyVariant={serverHomepageCopyVariant} />
			<DeferredHomepageSections />
			<div className="mt-20 sm:mt-[120px] lg:mt-[180px]">
				<Faq />
			</div>
			<DeferredHomepageClosingSections />
		</>
	);
}
