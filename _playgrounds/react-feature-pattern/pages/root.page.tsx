import "~/assets/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ServiceProvider } from "~/providers/service-provider";
import { IndexPage } from "./index.page";
import { ServicePage } from "./service.page";
import { StorePage } from "./store.page";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ServiceProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<IndexPage />} />
					<Route path="/store" element={<StorePage />} />
					<Route path="/service" element={<ServicePage />} />
				</Routes>
			</BrowserRouter>
		</ServiceProvider>
	</StrictMode>,
);
