import { Box } from "@mantine/core";
import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";
import { fixtures } from "~/fixtures/messages.json.ts";

export type TMessages = {
	messages: Array<UIMessage>;
};

const messagesFixtures = fixtures.messages;

export function Messages({ messages }: TMessages) {
	const visibleMessages = messagesFixtures;

	return (
		<Box className="w-160">
			{visibleMessages.map((message) => (
				<div key={message.id}>
					{message.role === "user" ? "User: " : "AI: "}
					{message.parts.map((part, index) =>
						part.type === "text" ? <Streamdown key={message.id + Number(index)}>{part.text}</Streamdown> : null,
					)}
				</div>
			))}
		</Box>
	);
}
