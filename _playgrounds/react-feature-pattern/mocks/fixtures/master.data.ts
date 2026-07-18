import { faker } from "@faker-js/faker";

const statusForPost = [
	{ id: "archived", label: "Archived", value: "Archived" },
	{ id: "draft", label: "Draft", value: "Draft" },
	{ id: "published", label: "Published", value: "Published " },
];

const category = [
	{ id: "technology", label: "Technology", value: "technology" },
	{ id: "business", label: "Business", value: "business" },
	{ id: "health", label: "Health", value: "health" },
	{ id: "science", label: "Science", value: "science" },
	{ id: "education", label: "Education", value: "education" },
	{ id: "entertainment", label: "Entertainment", value: "entertainment" },
];

const status = [
	{ id: "active", label: "Active", value: "active" },
	{ id: "inactive", label: "Inactive", value: "inactive" },
	{ id: "pending", label: "Pending", value: "pending" },
];

const project = [
	{ id: "001A", name: "001A" },
	{ id: "001B", name: "001B" },
	{ id: "001C", name: "001C" },
	{ id: "001D", name: "001D" },
];

const role = [
	{ id: "admin", level: 1, name: "Admin" },
	{ id: "user", level: 2, name: "User" },
	{ id: "guest", level: 3, name: "Guest" },
];

const grade = [
	{ id: "A", label: "A", value: "A" },
	{ id: "B", label: "B", value: "B" },
	{ id: "C", label: "C", value: "C" },
];

// ==========================================================================================
// @Exports
// ==========================================================================================

export const masterData = {
	role: () => faker.helpers.arrayElement(role),
	project: () => faker.helpers.arrayElement(project),
	status: () => faker.helpers.arrayElement(status),
	statusForPost: () => faker.helpers.arrayElement(statusForPost),
	category: () => faker.helpers.arrayElement(category),
	grade: () => faker.helpers.arrayElement(grade),
	fixtures: { role, project, status, statusForPost, category, grade },
};
