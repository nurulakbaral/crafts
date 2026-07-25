import { agent } from "./Agent.js";

agent.subscribe((event) => {
	if (event.type === "message_update" && event.assistantMessageEvent.type === "text_delta") {
		process.stdout.write(event.assistantMessageEvent.delta);
	}
});

await agent.prompt("Hello! Who are you? Which model are you using?");

process.stdout.write("\n");
