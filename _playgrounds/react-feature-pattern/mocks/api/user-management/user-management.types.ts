import type { userManagementCollection } from "./user-management.collection";

export namespace TTypesUserManagement {
	export type User = ReturnType<typeof userManagementCollection.users.all>[number];

	export type ResponseUsers = {
		code: number;
		message: string;
		data: ReturnType<typeof userManagementCollection.users.all>;
		total: number;
		page: number;
		limit: number;
	};
}
