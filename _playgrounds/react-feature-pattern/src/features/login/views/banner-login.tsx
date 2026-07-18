import { Box, type BoxProps, type ElementProps, Image, Text, Title } from "@mantine/core";
import type * as React from "react";

type TBannerLoginProps = React.PropsWithChildren<ElementProps<"section", keyof BoxProps> & BoxProps>;

// ==========================================================================================
// @Main — Banner Login
// ==========================================================================================

export function BannerLogin({ ...props }: TBannerLoginProps) {
	return (
		<Box
			component="section"
			className="relative isolate hidden min-h-[620px] overflow-hidden rounded-[22px] sm:block lg:min-h-full"
			{...props}
		>
			<Image
				src="/banner-login.png"
				alt="Abstract pastel artwork"
				className="absolute inset-0 -z-20 h-full w-full object-cover"
			/>
			<Box className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(49,39,143,0.58)_0%,rgba(60,46,159,0.42)_48%,rgba(28,21,105,0.68)_100%)]" />

			<Box className="flex h-full min-h-[620px] flex-col justify-center px-[clamp(3rem,5vw,6rem)] py-16 lg:min-h-full">
				<Box className="max-w-[640px]">
					<Title
						order={2}
						className="text-[38px] font-medium leading-[1.22] tracking-[-0.035em] text-white xl:text-[48px]"
					>
						Effortlessly manage your team and operations.
					</Title>
					<Text className="mt-5 max-w-[590px] text-[15px] leading-7 text-white/80 xl:text-[17px]">
						Log in to access your CRM dashboard and manage your team.
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
