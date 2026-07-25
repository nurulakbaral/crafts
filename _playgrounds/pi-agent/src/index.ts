import { Agent } from "@earendil-works/pi-agent-core";
import { createModels } from "@earendil-works/pi-ai";
import { openaiCodexProvider } from "@earendil-works/pi-ai/providers/openai-codex";
import { credentials } from "./credential.js";

const models = createModels({ credentials });
models.setProvider(openaiCodexProvider());
const model = models.getModel("openai-codex", "gpt-5.6-terra");

if (!model) {
	throw new Error("Model not found, ");
}

const agent = new Agent({
	initialState: {
		systemPrompt: "You are a helpful assistant.",
		model,
	},
	streamFn: models.streamSimple.bind(models),
});

agent.subscribe((event) => {
	if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
		process.stdout.write(event.assistantMessageEvent.delta);
	}
});

await agent.prompt("Hello! Who are you? Which model are you using?");

process.stdout.write("\n");
