import { Box } from "@mantine/core";
import { createCodePlugin } from "@streamdown/code";
import type { UIMessage } from "ai";
import { Streamdown } from "streamdown";

const code = createCodePlugin({
	themes: ["dark-plus", "github-dark"], // [light, dark]
});

export type TMessages = {
	messages: Array<UIMessage>;
};

export function Messages({ messages }: TMessages) {
	return (
		<Box className="w-full max-w-160">
			{messages.map((message) => (
				<div key={message.id}>
					{message.role === "user" ? "User: " : "AI: "}
					{message.parts.map((part, index) =>
						part.type === "text" ? (
							<Streamdown
								plugins={{
									code,
								}}
								key={message.id + Number(index)}
							>
								{part.text}
							</Streamdown>
						) : null,
					)}
				</div>
			))}
		</Box>
	);
}
