import "~/assets/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { IndexPage } from "./index.page";
import { ServicePage } from "./service.page";
import { StatePage } from "./state.page";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/state" element={<StatePage />} />
				<Route path="/service" element={<ServicePage />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
