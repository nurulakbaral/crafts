import { userManagementCollection } from "@mocks/api/user-management/user-management.collection";
import { createUrl } from "@mocks/msw.utils";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { delay, HttpResponse, http } from "msw";
import { utilsApi } from "../api.utils";
import { masterDataCollection } from "../master-data/master-data.collection";
import type { TTypesUserManagement } from "./user-management.types";

dayjs.extend(isBetween);

const usersRoute = http.get(createUrl("client")("/mock/user-management/users"), async ({ request }) => {
	const url = new URL(request.url);
	// @Notes Filtering
	const user = url.searchParams.get("user");
	const role = url.searchParams.get("role");
	const project = url.searchParams.get("project");
	const status = url.searchParams.get("status");
	const grade = url.searchParams.get("grade");
	const created_at = url.searchParams.get("created_at");
	// @Notes Searching
	const query = url.searchParams.get("query");
	const search = url.searchParams.get("search");
	// @Notes Sorting
	const sort = (url.searchParams.get("sort") || "name") as "name";
	const order = url.searchParams.get("order") || "asc";
	const orderByMap = {
		name: { name: order === "asc" ? ("asc" as const) : ("desc" as const) },
		role: { role: { name: order === "asc" ? ("asc" as const) : ("desc" as const) } },
		project: { project: { name: order === "asc" ? ("asc" as const) : ("desc" as const) } },
		status: { status: { label: order === "asc" ? ("asc" as const) : ("desc" as const) } },
		grade: { grade: order === "asc" ? ("asc" as const) : ("desc" as const) },
		createdAt: { created_at: order === "asc" ? ("asc" as const) : ("desc" as const) },
	};
	// @Notes Pagination
	const page = Number(url.searchParams.get("page")) || 1;
	const limit = Number(url.searchParams.get("limit")) || 10;

	await delay(1200);

	if (query) {
		return HttpResponse.json<TTypesUserManagement.ResponseUsers>({
			code: 200,
			message: "success",
			total: userManagementCollection.users.count(),
			page,
			limit,
			data: userManagementCollection.users.findMany(($) =>
				$.where({ name: (prop) => !query || prop.toLowerCase().startsWith(query.toLowerCase()) }),
			),
		});
	}

	return HttpResponse.json<TTypesUserManagement.ResponseUsers>({
		code: 200,
		message: "success",
		total: userManagementCollection.users.count(),
		page,
		limit,
		data: userManagementCollection.users.findMany(
			($) =>
				$
					// @Notes General Search
					.or({ name: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) })
					.or({ role: { name: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) } })
					.or({ project: { name: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) } })
					.or({ status: { value: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) } })
					.or({ grade: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) })
					.or({ created_at: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) })
					// @Notes Filtering
					.and({ name: (prop) => !user || prop.toLowerCase().startsWith(user.toLowerCase()) })
					.and({ role: { id: (prop) => !role || role.split(",").includes(prop) } })
					.and({ project: { name: (prop) => !project || project.split(",").includes(prop) } })
					.and({ status: { value: (prop) => !status || status.split(",").includes(prop) } })
					.and({ grade: (prop) => !grade || grade.split(",").includes(prop) })
					.and({ created_at: (prop) => !created_at || utilsApi.rangeDate(created_at, prop) }),
			{
				skip: (page - 1) * limit,
				take: limit,
				orderBy: orderByMap[sort],
			},
		),
	});
});

const userEditRoute = http.put(createUrl("client")("/mock/user-management/users/:id"), async ({ request, params }) => {
	const userId = params.id;
	const userBody = (await request.json()) as {
		id: string;
		name: string;
		role: string;
		project: string;
		status: string;
		grade: string;
	};

	if (userId) {
		const role = masterDataCollection.roles.findFirst(($) => $.where({ id: (id) => id === userBody.role }));
		const project = masterDataCollection.projects.findFirst(($) => $.where({ id: (id) => id === userBody.project }));
		const status = masterDataCollection.status.findFirst(($) => $.where({ id: (id) => id === userBody.status }));
		const grade = masterDataCollection.grades.findFirst(($) => $.where({ id: (id) => id === userBody.grade }));

		if (role && project && status && grade) {
			userManagementCollection.users.update(($) => $.where({ id: (id) => id === userId }), {
				data(user) {
					user.name = userBody.name;
					user.role = role;
					user.project = project;
					user.status = status;
					user.grade = grade.id;
				},
			});
		}
	}

	await delay(2000);

	return HttpResponse.json({
		code: 200,
		message: "success",
	});
});

const userDeleteRoute = http.delete(createUrl("client")("/mock/user-management/users/:id"), ({ params }) => {
	const userId = params.id;

	if (userId) {
		userManagementCollection.users.delete((q) => q.where({ id: (id) => id === userId }));
	}

	return HttpResponse.json({
		code: 200,
		message: "success",
	});
});

// ------------------------------------------------------------------------------------------
// @Router
// ------------------------------------------------------------------------------------------

export const userManagementRouter = [usersRoute, userEditRoute, userDeleteRoute];
