import { Box } from "@mantine/core";
import type { UIMessage } from "ai";

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
						part.type === "text" ? <span key={`${message.id}-${Number(index)}`}>{part.text}</span> : null,
					)}
				</div>
			))}
		</Box>
	);
}
