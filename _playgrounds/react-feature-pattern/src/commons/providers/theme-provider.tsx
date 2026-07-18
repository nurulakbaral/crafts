import { MantineProvider, type MantineProviderProps } from "@mantine/core";
import { theme } from "~/commons/configs";

// ------------------------------------------------------------------------------------------
// @MainComponent — Theme Provider
// ------------------------------------------------------------------------------------------

export type TThemeProvidersProps = {} & MantineProviderProps;

export function ThemeProvider({ children, ...props }: TThemeProvidersProps) {
	return (
		<MantineProvider theme={theme} defaultColorScheme="light" {...props}>
			{children}
		</MantineProvider>
	);
}
