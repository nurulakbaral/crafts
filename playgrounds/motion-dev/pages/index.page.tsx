import { Box, Button, Stack, Text } from "@mantine/core";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import * as React from "react";

function EnterPolymorphismAnimation() {
	const [isEntering, setIsEntering] = React.useState(true);

	return (
		<Box className="text-center p-4 border-2 border-gray-200">
			<Box
				component={motion.div}
				initial={false}
				animate={{ scale: isEntering ? 1 : 0.5 }}
				transition={{ duration: 0.75 }}
				className="mx-auto w-20 h-20 bg-orange-400 mt-20"
			/>

			<LayoutGroup>
				<AnimatePresence mode="wait">
					{isEntering ? (
						<Text
							layout
							key="exit-mode"
							component={motion.p}
							initial={{ opacity: 0 }}
							exit={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-5xl font-bold my-12"
						>
							Hello World!
						</Text>
					) : null}
				</AnimatePresence>

				<Box component={motion.div} layout>
					<Button className="mt-6" onClick={() => setIsEntering(!isEntering)} type="button">
						Toggle Enter
					</Button>
				</Box>
			</LayoutGroup>
		</Box>
	);
}

function ExitAnimation() {
	const [isEntering, setIsEntering] = React.useState(true);

	return (
		<Box className="text-center p-4 border-2 border-gray-200">
			<AnimatePresence>
				{isEntering && (
					<motion.div
						key="exit-mode"
						exit={{ scale: 0 }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.75 }}
						className="mx-auto w-20 h-20 bg-green-400 mt-20"
					/>
				)}
			</AnimatePresence>

			<Button className="mt-10" onClick={() => setIsEntering(!isEntering)} type="button">
				Toggle Exit
			</Button>
		</Box>
	);
}

function EnterAnimation() {
	const [isEntering, setIsEntering] = React.useState(true);

	return (
		<Box className="text-center p-4 border-2 border-gray-200">
			<motion.div
				initial={false}
				animate={{ scale: isEntering ? 1 : 0.5 }}
				transition={{ duration: 0.75 }}
				className="mx-auto w-20 h-20 bg-green-400 mt-20"
			/>

			<Button className="mt-6" onClick={() => setIsEntering(!isEntering)} type="button">
				Toggle Enter
			</Button>
		</Box>
	);
}

export default function App() {
	return (
		<Stack gap={12} className="p-10">
			<EnterAnimation />
			<EnterPolymorphismAnimation />
			<ExitAnimation />
		</Stack>
	);
}
