import { faker } from "@faker-js/faker";
import { masterData } from "@mocks/fixtures";
import { Collection } from "@msw/data";
import * as z from "zod";

const users = new Collection({
	schema: z.object({
		id: z.uuidv4(),
		name: z.string().min(2).max(255),
		avatar_url: z.url(),
		identity_number: z.string().min(5).max(255),
		job_title: z.object({
			id: z.uuidv4(),
			name: z.string().min(2).max(255),
		}),
		role: z.object({
			id: z.string(),
			level: z.number(),
			name: z.string().min(2).max(255),
		}),
		project: z.object({
			id: z.string(),
			name: z.string().min(2).max(255),
		}),
		status: z.object({
			id: z.string(),
			label: z.string().min(2).max(255),
			value: z.string().min(2).max(255),
		}),
		grade: z.string().min(1).max(1),
		created_at: z.string(),
	}),
});

// ------------------------------------------------------------------------------------------
// @Seeding
// ------------------------------------------------------------------------------------------

const authors: Array<{ id: string; name: string; identity_number: string }> = [];

for (const _ of Array.from({ length: 32 })) {
	const role = masterData.role();
	const project = masterData.project();
	const status = masterData.status();
	const user = await users.create({
		id: faker.string.uuid(),
		name: faker.person.firstName(),
		avatar_url: faker.image.avatar(),
		identity_number: faker.string.numeric({ length: 10 }),
		job_title: { id: faker.string.uuid(), name: faker.person.jobTitle() },
		role: { id: role.id, level: role.level, name: role.name },
		project: { id: project.id, name: project.name },
		status: { id: status.id, label: status.label, value: status.value },
		grade: faker.string.fromCharacters("ABC", 1),
		created_at: faker.date.past().toDateString(),
	});

	authors.push({ id: user.id, name: user.name, identity_number: user.identity_number });
}

// ------------------------------------------------------------------------------------------
// @Collection
// ------------------------------------------------------------------------------------------

export const userManagementCollection = { users, authors };
