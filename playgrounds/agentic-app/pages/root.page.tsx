import "~/assets/globals.css";
import "streamdown/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { NetworkProvider, ThemeProvider } from "~/providers";
import App from "./index.page";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NetworkProvider>
			<ThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<App />} />
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</NetworkProvider>
	</StrictMode>,
);
