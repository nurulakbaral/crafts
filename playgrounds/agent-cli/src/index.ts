import { mistral } from "@ai-sdk/mistral";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";

const promptImprover = tool({
	title: "Prompt Improver",
	description: `
    Translate any language to English and improves the given prompt by adding context or clarifying instructions.
    Use the improved prompt to generate a response.
  `,
	inputSchema: z.object({
		improvedPrompt: z.string(),
	}),
	execute: ({ improvedPrompt }) => {
		return { improvedPrompt };
	},
});

const result = streamText({
	model: mistral("mistral-medium-latest"),
	prompt: "Whatssssmaacineee lanrngs.",
	tools: { promptImprover },
	stopWhen: stepCountIs(2),
});

for await (const part of result.fullStream) {
	if (part.type === "start") {
		process.stdout.write(`\n ======================== Start ======================== \n`);
	}

	if (part.type === "tool-call") {
		process.stdout.write(`\n 🧠 Tool Call: ${part.title} \n`);
	}

	if (part.type === "tool-result") {
		process.stdout.write(`\n    Tool Input: ${JSON.stringify(part.input)} \n`);
	}

	if (part.type === "text-start") {
		process.stdout.write(`\n`);
	}

	if (part.type === "text-delta") {
		process.stdout.write(part.text);
	}

	if (part.type === "text-end") {
		process.stdout.write(`\n`);
	}

	if (part.type === "finish") {
		process.stdout.write(`\n ======================== End ======================== \n`);
	}
}
