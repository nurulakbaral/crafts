import "~/assets/globals.css";
import { listenAndServeMocks } from "@mocks/main";
import { StrictMode, startTransition } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ServiceProvider, ThemeProvider } from "~/commons/providers/index";
import { IndexPage } from "./index.page";
import { LoginPage } from "./login.page";

listenAndServeMocks().then(() => {
	startTransition(() => {
		createRoot(document.getElementById("root")!).render(
			<StrictMode>
				<ServiceProvider>
					<ThemeProvider>
						<BrowserRouter>
							<Routes>
								<Route path="/" element={<IndexPage />} />
								<Route path="/login" element={<LoginPage />} />
							</Routes>
						</BrowserRouter>
					</ThemeProvider>
				</ServiceProvider>
			</StrictMode>,
		);
	});
});
