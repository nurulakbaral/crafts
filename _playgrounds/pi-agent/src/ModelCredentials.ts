import fs from "node:fs";

type TAuthJson = {
	[key: string]: {
		type: "oauth";
		access: string;
		refresh: string;
		expires: number;
		accountId: string;
	};
};

export class ModelCredentials {
	private readonly authJson: TAuthJson;

	constructor(authJsonPath: string) {
		const data = fs.readFileSync(authJsonPath, "utf8");
		this.authJson = JSON.parse(data);
	}

	getAuthJson(providerId: "openai-codex" | (string & {})): TAuthJson[string] | undefined {
		return this.authJson[providerId];
	}
}
