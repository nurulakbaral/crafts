import {
	Anchor,
	Box,
	type BoxProps,
	Button,
	Checkbox,
	Divider,
	type ElementProps,
	Group,
	Image,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import type * as React from "react";

// ==========================================================================================
// @Main — Form Login
// ==========================================================================================

type TFormLoginProps = React.PropsWithChildren<ElementProps<"section", keyof BoxProps> & BoxProps>;

export function FormLogin({ ...props }: TFormLoginProps) {
	return (
		<Box
			component="section"
			className="flex flex-col px-6 py-8 sm:px-10 sm:py-10 md:px-16 lg:px-[clamp(3rem,5vw,6.5rem)] lg:py-10 xl:py-12"
			{...props}
		>
			<Group gap="sm" className="shrink-0">
				<Image src="/icon.png" alt="Sellora logo" className="size-10 object-contain mix-blend-multiply" />
				<Text className="text-[22px] font-bold tracking-[-0.03em] text-[#17171c]">Sellora</Text>
			</Group>

			<Box className="mx-auto flex w-full max-w-130 flex-1 items-center py-12 lg:py-10">
				<Box className="w-full">
					<Title
						order={1}
						className="text-center text-[34px] font-bold leading-tight tracking-[-0.035em] text-[#17171c] sm:text-[40px]"
					>
						Welcome Back
					</Title>
					<Text className="mx-auto mt-4 max-w-107.5 text-center text-[14px] leading-6 text-[#8b8b94] sm:text-[15px]">
						Enter your email and password to access your account.
					</Text>

					<Box component="form" className="mt-10 sm:mt-12">
						<TextInput
							label="Email"
							defaultValue="sellostore@company.com"
							size="md"
							classNames={{
								label: "mb-2 text-[13px] font-semibold text-[#29292f]",
								input: "h-12 rounded-lg border-[#e7e7eb] bg-white px-4 text-[15px] text-[#24242a] shadow-none",
							}}
						/>

						<PasswordInput
							label="Password"
							defaultValue="5ellostore."
							size="md"
							className="mt-5"
							classNames={{
								label: "mb-2 text-[13px] font-semibold text-[#29292f]",
								input: "h-12 rounded-lg border-[#e7e7eb] bg-white text-[15px] text-[#24242a] shadow-none",
								innerInput: "h-12 px-4 pr-12",
								visibilityToggle: "mr-1 text-[#a1a1aa]",
							}}
						/>

						<Group justify="space-between" gap="sm" className="mt-4">
							<Checkbox
								label="Remember Me"
								size="sm"
								classNames={{
									input: "cursor-pointer border-[#b7b7be]",
									label: "cursor-pointer pl-2 text-[13px] text-[#85858e]",
								}}
							/>
							<Anchor href="#" underline="never" className="text-[13px] font-medium text-[#3e38e8]">
								Forgot Your Password?
							</Anchor>
						</Group>

						<Button
							type="button"
							fullWidth
							className="mt-7 h-12 rounded-lg bg-[#4038f5] text-[15px] font-medium shadow-none hover:bg-[#332cdd]"
						>
							Log In
						</Button>

						<Divider
							label="Or Login With"
							labelPosition="center"
							className="my-7 border-[#e8e8ec] text-[13px] text-[#898992]"
						/>
					</Box>

					<Text className="mt-7 text-center text-[13px] text-[#8b8b94]">
						Don’t Have An Account?{" "}
						<Anchor href="#" underline="never" className="font-medium text-[#3e38e8]">
							Register Now.
						</Anchor>
					</Text>
				</Box>
			</Box>
		</Box>
	);
}
