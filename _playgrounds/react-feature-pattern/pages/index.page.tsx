import { ServicePage } from "./service.page";
import { StorePage } from "./store.page";

export function IndexPage() {
	return (
		<section className="flex flex-col min-h-screen">
			<div className="border flex-1 m-10 p-10">
				<p className="text-center">Page Container</p>

				<ServicePage />

				<StorePage />
			</div>
		</section>
	);
}
