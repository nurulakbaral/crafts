import { useChat } from "@ai-sdk/react";
import { Box, Stack } from "@mantine/core";
import { DefaultChatTransport } from "ai";
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
		<Box className="min-h-screen relative bg-gray-100">
			<Stack className="w-full h-full" align="center">
				{storeConv.streaming && <Messages messages={messages} />}
			</Stack>

			<Stack
				gap={36}
				className={cx(
					"w-full bg-white pb-6 h-64",
					!storeConv.streaming && "min-h-screen pt-56",
					storeConv.streaming && "sticky top-[calc(100vh-calc(var(--spacing) * 64)] bottom-0 pt-6",
				)}
				align="center"
			>
				<Greetings />

				<Composer conversation={true} onSend={(text) => {}} />
			</Stack>
		</Box>
	);
}
