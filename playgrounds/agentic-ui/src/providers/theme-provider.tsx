import { createTheme, MantineProvider, type MantineProviderProps } from "@mantine/core";

// ------------------------------------------------------------------------------------------
// Theme
// ------------------------------------------------------------------------------------------

const Theme = createTheme({});

// ------------------------------------------------------------------------------------------
// @MainComponent — Theme Provider
// ------------------------------------------------------------------------------------------

export type TThemeProvidersProps = {} & MantineProviderProps;

export function ThemeProvider({ children, ...props }: TThemeProvidersProps) {
	return (
		<MantineProvider theme={Theme} defaultColorScheme="light" {...props}>
			{children}
		</MantineProvider>
	);
}
