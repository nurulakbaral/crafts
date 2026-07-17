"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";
import { appContainer } from "~/libraries/app-container";

// ------------------------------------------------------------------------------------------
// @Main - Service Provider
// ------------------------------------------------------------------------------------------

export interface TServiceProviderProps {
	children: React.ReactNode;
}

export function ServiceProvider({ children, ...props }: TServiceProviderProps) {
	return (
		<QueryClientProvider client={appContainer.cradle.queryClient} {...props}>
			{children}

			<ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		</QueryClientProvider>
	);
}
