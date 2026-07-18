import { faker } from "@faker-js/faker";
import { Collection } from "@msw/data";
import * as z from "zod";
import { userManagementCollection } from "~/mocks/api/user-management/user-management.collection";
import { masterData } from "~/mocks/fixtures";

const categories = new Collection({
	schema: z.object({
		id: z.string(),
		value: z.string().min(2).max(50),
		label: z.string().min(2).max(50),
	}),
});

const posts = new Collection({
	schema: z.object({
		id: z.uuidv4(),
		title: z.string(),
		description: z.string(),
		content: z.string(),
		published_at: z.string(),
		status: z.object({
			id: z.string(),
			value: z.string().min(2).max(50),
			label: z.string().min(2).max(50),
		}),
		category: z.object({
			id: z.string(),
			value: z.string().min(2).max(50),
			label: z.string().min(2).max(50),
		}),
		author: z.object({
			id: z.uuidv4(),
			name: z.string().min(2).max(255),
			identity_number: z.string().min(5).max(255),
		}),
	}),
});

// ------------------------------------------------------------------------------------------
// @Seeding
// ------------------------------------------------------------------------------------------

for (const category of masterData.fixtures.category) {
	await categories.create({
		id: category.id,
		value: category.value,
		label: category.label,
	});
}

for (const _ of Array.from({ length: 32 })) {
	const category = masterData.category();
	const status = masterData.statusForPost();

	await posts.create({
		id: faker.string.uuid(),
		title: faker.lorem.words({ min: 2, max: 3 }),
		description: faker.lorem.words({ min: 10, max: 25 }),
		content: faker.lorem.words({ min: 2, max: 255 }),
		published_at: faker.date.past().toISOString(),
		status: { id: status.id, value: status.value, label: status.label },
		category: { id: category.id, value: category.value, label: category.label },
		author: faker.helpers.arrayElement(userManagementCollection.authors),
	});
}

// ------------------------------------------------------------------------------------------
// @Collection
// ------------------------------------------------------------------------------------------

export const blogPostCollection = { categories, posts };
