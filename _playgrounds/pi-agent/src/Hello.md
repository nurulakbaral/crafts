```ts
import { stdin, stdout } from "node:process";
import readline from "node:readline/promises";
import { Agent } from "@earendil-works/pi-agent-core";
import { createModels } from "@earendil-works/pi-ai";
import { openaiCodexProvider } from "@earendil-works/pi-ai/providers/openai-codex";
import { ModelCredentials } from "./ModelCredentials.js";

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

const models = createModels({
  credentials: new ModelCredentials("./auth.json"),
});
models.setProvider(openaiCodexProvider());

const provider = models.getProvider("openai-codex");

const credential = await provider?.auth?.oauth!.login({
  notify(event) {
    console.log("notify:", event);
  },

  async prompt(prompt) {
    console.log("prompt:", prompt);

    return await rl.question("> ");
  },
});

console.log(credential);

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
```
