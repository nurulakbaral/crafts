import { useChat } from "@ai-sdk/react";
import { Box, Stack, Text } from "@mantine/core";
import { DefaultChatTransport } from "ai";
import { motion } from "motion/react";
import { Composer, Greetings, Messages } from "~/components";
import { cx } from "~/libraries";
import { useStoreConv } from "~/stores";

export default function App() {
	const storeConv = useStoreConv();
	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: "http://localhost:3000/chat",
		}),
	});

	return (
		<Box className="min-h-screen relative bg-white">
			<Stack className={cx("w-full h-full", storeConv.streaming && "pb-10")} align="center">
				{storeConv.streaming && <Messages messages={messages} />}
			</Stack>

			<motion.div
				initial={false}
				className={cx(
					"w-full bg-white flex flex-col items-center gap-9 overflow-hidden",
					!storeConv.streaming && "pt-44",
					storeConv.streaming && "sticky top-[calc(100vh-10rem)] bottom-0",
					storeConv.streaming && "pb-0",
				)}
				animate={{
					height: storeConv.streaming ? "10rem" : "100vh",
				}}
				transition={{ type: "spring", stiffness: 360, damping: 36 }}
			>
				{!storeConv.streaming && <Greetings />}

				<Stack gap={12}>
					<Composer className={cx("h-fit")} conversation={true} onSend={(text) => sendMessage({ text })} />

					{storeConv.streaming && (
						<Text className="text-center text-sm text-gray-600">AgentAI can make mistakes. Check important info.</Text>
					)}
				</Stack>
			</motion.div>
		</Box>
	);
}
