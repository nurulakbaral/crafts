import { mistral } from "@ai-sdk/mistral";
import { stepCountIs, streamText, tool } from "ai";
import { z } from "zod";

const originalFetch = globalThis.fetch;

globalThis.fetch = async (...args) => {
	const [input, init] = args;

	let body = init?.body;

	if (!body && input instanceof Request) {
		body = await input.clone().text();
	}

	// @Notes for debugging.

	// console.log({
	// 	url: typeof input === "string" ? input : input.url,
	// 	method: init?.method || (input instanceof Request ? input.method : "GET"),
	// 	headers: init?.headers || (input instanceof Request ? Object.fromEntries(input.headers) : undefined),
	// 	body,
	// });

	return originalFetch(...args);
};

const getMinimalDatabase = tool({
	title: "Minimal database of secret sources",
	description: `This is a minimal database of secret sources`,
	inputSchema: z.object({
		nouns: z.array(z.string()),
	}),
	execute: ({ nouns }) => {
		return {
			nouns,
			database: `
        1. Walalable is slang words about greetings in Talun
        2. Totomante is animal from Talun

        You can see more details here: https://big-database.com
      `,
		};
	},
});

const getBigDatabase = tool({
	title: "Big database of all secret sources",
	description: `This is a database of all secret sources`,
	inputSchema: z.object({
		// @Notes This "describe" is used to make sure the links are retrieved from the minimal database.
		// If we don't use "describe", the LLM may use its own dataset instead.
		links: z.array(z.string()).describe("List of links from minimal database"),
	}),
	execute: ({ links }) => {
		return {
			links,
			database: `
        1. Cat is a person name that means CatWorld in Talun!
      `,
		};
	},
});

const result = streamText({
	model: mistral("mistral-medium-latest"),
	// @Notes This system prompt is trigger the "databases" calls.
	// Even though the word "Cat" is common and exists in the LLM model database,
	// we prioritize retrieving it from our own database, before they use their dataset.
	system: "Always prioritize the database",
	prompt: "What is Cat?",
	tools: { getMinimalDatabase, getBigDatabase },
	stopWhen: stepCountIs(3),
	toolChoice: "auto",
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
