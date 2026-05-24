import { Box } from "@mantine/core";
import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

export type TMessages = {
	messages: Array<UIMessage>;
};

export function Messages({ messages }: TMessages) {
	return (
		<Box className="w-160">
			{messages.map((message) => (
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
