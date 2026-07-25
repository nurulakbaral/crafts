import { Agent } from "@earendil-works/pi-agent-core";
import { createModels } from "@earendil-works/pi-ai";
import { openaiCodexProvider } from "@earendil-works/pi-ai/providers/openai-codex";
import { ModelCredentials } from "./ModelCredentials.js";

const models = createModels({ credentials: new ModelCredentials("./auth.json") });
models.setProvider(openaiCodexProvider());

const model = models.getModel("openai-codex", "gpt-5.6-terra");
if (!model) {
	throw new Error("Model not found, ");
}

export const agent = new Agent({
	initialState: {
		systemPrompt: "You are a helpful assistant.",
		model,
	},
	streamFn: models.streamSimple.bind(models),
});
