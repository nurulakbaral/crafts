import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

// ------------------------------------------------------------------------------------------
// @MainComponent - Network Provider
// ------------------------------------------------------------------------------------------

export interface TNetworkProviderProps {
	children: React.ReactNode;
}

export function NetworkProvider({ children, ...props }: TNetworkProviderProps) {
	const [queryClient] = React.useState(() => new QueryClient({}));

	return (
		<QueryClientProvider {...props} client={queryClient}>
			{children}

			<ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
		</QueryClientProvider>
	);
}
