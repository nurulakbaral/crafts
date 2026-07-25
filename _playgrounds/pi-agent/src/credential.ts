import fs from "node:fs/promises";
import type { CredentialInfo, CredentialStore } from "@earendil-works/pi-ai";

const AUTH_PATH = "./auth.json";

async function load() {
	try {
		return JSON.parse(await fs.readFile(AUTH_PATH, "utf8"));
	} catch {
		return {};
	}
}

async function save(data: any) {
	await fs.writeFile(AUTH_PATH, JSON.stringify(data, null, 2));
}

export const credentials: CredentialStore = {
	async read(providerId) {
		const auth = await load();
		return auth[providerId] ?? null;
	},

	async list(): Promise<CredentialInfo[]> {
		const auth = await load();

		return Object.entries(auth).map(([providerId, cred]: any) => ({
			providerId,
			type: cred.type,
		}));
	},

	async modify(providerId, fn) {
		const auth = await load();

		const updated = await fn(auth[providerId] ?? null);

		if (updated) auth[providerId] = updated;

		await save(auth);

		return updated;
	},

	async delete(providerId) {
		const auth = await load();
		delete auth[providerId];
		await save(auth);
	},
};
