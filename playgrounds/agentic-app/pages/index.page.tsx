import { useChat } from "@ai-sdk/react";
import { Box, Stack } from "@mantine/core";
import { DefaultChatTransport } from "ai";
import { Composer, Greetings, Messages } from "~/components";

export default function App() {
	const { messages, sendMessage } = useChat({
		transport: new DefaultChatTransport({
			api: "http://localhost:3000/chat",
		}),
	});

	return (
		<Box>
			<Stack className="w-full" align="center">
				<Messages messages={messages} />
			</Stack>

			<Stack gap={36} className="w-full min-h-screen pt-54" align="center">
				<Greetings />

				<Composer
					onSend={(text) => {
						sendMessage({ text: text });
					}}
				/>
			</Stack>
		</Box>
	);
}
