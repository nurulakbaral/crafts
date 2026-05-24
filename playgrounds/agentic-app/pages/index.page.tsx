import { useChat } from "@ai-sdk/react";
import { Box, Stack, Text } from "@mantine/core";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { Composer, Greetings, Messages } from "~/components";
import { useStoreConv } from "~/stores";

const composerTransition = { type: "spring", stiffness: 360, damping: 38 } as const;

export default function App() {
	const storeConv = useStoreConv();
	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: "http://localhost:3000/chat",
		}),
	});

	return (
		<Box className="relative min-h-dvh bg-white">
			<Stack className="mx-auto w-full max-w-160 px-4 pt-8 pb-44" align="center">
				{storeConv.streaming && <Messages messages={messages} />}
			</Stack>

			<motion.div
				initial={false}
				className="fixed inset-x-0 bottom-0 z-10 flex justify-center overflow-hidden bg-white px-4"
				animate={{ height: storeConv.streaming ? "10rem" : "100dvh" }}
				transition={composerTransition}
			>
				<motion.div
					initial={false}
					className="flex w-full max-w-172 flex-col items-center"
					animate={{ y: storeConv.streaming ? 12 : 176 }}
					transition={composerTransition}
				>
					<AnimatePresence initial={false}>
						{!storeConv.streaming && (
							<motion.div
								key="greetings"
								className="overflow-hidden"
								initial={false}
								animate={{ height: "auto", opacity: 1, marginBottom: 36 }}
								exit={{ height: 0, opacity: 0, marginBottom: 0 }}
								transition={{ duration: 0.18, ease: "easeOut" }}
							>
								<Greetings />
							</motion.div>
						)}
					</AnimatePresence>

					<Stack className="w-full" gap={12}>
						<Composer className="h-fit" conversation={true} onSend={(text) => sendMessage({ text })} />

						<AnimatePresence initial={false}>
							{storeConv.streaming && (
								<motion.div
									key="disclaimer"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.18, ease: "easeOut" }}
								>
									<Text className="text-center text-sm text-gray-600">
										AgentAI can make mistakes. Check important info.
									</Text>
								</motion.div>
							)}
						</AnimatePresence>
					</Stack>
				</motion.div>
			</motion.div>
		</Box>
	);
}
