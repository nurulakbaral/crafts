import { Box, type BoxProps, type ElementProps } from "@mantine/core";
import type * as React from "react";
import { BannerLogin, FormLogin } from "~/features/login/views";

type TLoginPageProps = React.PropsWithChildren<ElementProps<"main", keyof BoxProps> & BoxProps>;

export function LoginPage({ ...props }: TLoginPageProps) {
	return (
		<Box component="main" className="min-h-dvh bg-[#f1f2f6] p-0 sm:p-4 xl:p-6" {...props}>
			<Box className="mx-auto grid min-h-dvh w-full max-w-[1800px] grid-cols-1 gap-4 overflow-hidden bg-white p-0 shadow-[0_24px_80px_rgba(31,35,48,0.12)] sm:min-h-[calc(100dvh-2rem)] sm:rounded-[28px] sm:p-4 lg:grid-cols-[1.03fr_0.97fr] xl:min-h-[calc(100dvh-3rem)]">
				<FormLogin />
				<BannerLogin />
			</Box>
		</Box>
	);
}
