import fs from "node:fs";
import type { Credential, CredentialStore } from "@earendil-works/pi-ai";

type TAuthJson = {
	[key: string]: { type: "oauth"; access: string; refresh: string; expires: number; accountId: string };
};

export class ModelCredentials implements CredentialStore {
	private readonly authJson: TAuthJson;

	constructor(authJsonPath: string) {
		const data = fs.readFileSync(authJsonPath, "utf8");
		this.authJson = JSON.parse(data);
	}

	getAuthJson(providerId: "openai-codex" | (string & {})): TAuthJson[string] | undefined {
		return this.authJson[providerId];
	}

	async read(providerId: string): ReturnType<CredentialStore["read"]> {
		return this.authJson[providerId];
	}

	async list(): ReturnType<CredentialStore["list"]> {
		return Object.entries(this.authJson).map(([providerId, { type, accountId }]) => ({
			type,
			providerId,
			accountId,
		}));
	}

	async modify(
		providerId: string,
		_fn: (current: Credential | undefined) => Promise<Credential | undefined>,
	): ReturnType<CredentialStore["modify"]> {
		return this.authJson[providerId];
	}

	async delete(providerId: string): ReturnType<CredentialStore["delete"]> {
		delete this.authJson[providerId];
	}
}
