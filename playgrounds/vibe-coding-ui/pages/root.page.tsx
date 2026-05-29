import "~/assets/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { NetworkProvider, ThemeProvider } from "~/providers";
import App from "./index.page";
import CompanyProfile from "./landing-pages/company-profile.page";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NetworkProvider>
			<ThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
						<Route path="/company-profile" element={<CompanyProfile />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</NetworkProvider>
	</StrictMode>,
);
