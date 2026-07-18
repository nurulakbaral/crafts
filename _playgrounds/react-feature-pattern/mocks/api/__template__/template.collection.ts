import { faker } from "@faker-js/faker";
import { Collection } from "@msw/data";
import * as z from "zod";

// @Docs MSW Data Modeling and Relation Docs: https://github.com/mswjs/data
// @Docs Faker JS Docs: https://fakerjs.dev/
export const posts = new Collection({
	schema: z.object({
		id: z.uuidv4(),
		title: z.string().min(2).max(255),
		description: z.string().min(3).max(500),
	}),
});

// ------------------------------------------------------------------------------------------
// @Seeding
// ------------------------------------------------------------------------------------------

// @Notes Don't forget to create the data first before returning it.
// Please restart the server to seed the data.
for (const _ of Array.from({ length: 10 })) {
	await posts.create({
		id: faker.string.uuid(),
		title: faker.lorem.words({ min: 2, max: 10 }),
		description: faker.lorem.sentences({ min: 3, max: 5 }),
	});
}

// ------------------------------------------------------------------------------------------
// @Collection
// ------------------------------------------------------------------------------------------

export const templateCollection = { posts };
