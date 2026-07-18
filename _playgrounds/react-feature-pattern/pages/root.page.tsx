import "~/assets/globals.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { ServiceProvider, ThemeProvider } from "~/commons/providers/index";
import { IndexPage } from "./index.page";
import { LoginPage } from "./login.page";

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
