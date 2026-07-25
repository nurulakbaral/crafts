import { masterData } from "@mocks/fixtures";
import { Collection } from "@msw/data";
import * as z from "zod";

const status = new Collection({
	schema: z.object({
		id: z.string(),
		value: z.string().min(1).max(225),
		label: z.string().min(1).max(225),
	}),
});

const projects = new Collection({
	schema: z.object({
		id: z.string(),
		name: z.string().min(1).max(225),
	}),
});

const roles = new Collection({
	schema: z.object({
		id: z.string(),
		level: z.number().min(1).max(255),
		name: z.string().min(1).max(225),
	}),
});

const grades = new Collection({
	schema: z.object({
		id: z.string(),
		label: z.string().min(1).max(1),
		value: z.string().min(1).max(1),
	}),
});

// ------------------------------------------------------------------------------------------
// @Seeding
// ------------------------------------------------------------------------------------------

masterData.fixtures.status.forEach((record) => {
	status.create(record);
});

masterData.fixtures.project.forEach((project) => {
	projects.create(project);
});

masterData.fixtures.role.forEach((role) => {
	roles.create(role);
});

masterData.fixtures.grade.forEach((grade) => {
	grades.create(grade);
});

// ------------------------------------------------------------------------------------------
// @Collection
// ------------------------------------------------------------------------------------------

export const masterDataCollection = { status, projects, roles, grades };
