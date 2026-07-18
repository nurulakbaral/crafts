import type { TTypesMsw } from "~/mocks/msw.types";
import type { masterDataCollection } from "./master-data.collection";

export namespace TTypesMasterData {
	export type ResponseStatus = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof masterDataCollection.status.all>;
	}>;

	export type ResponseProjects = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof masterDataCollection.projects.all>;
	}>;

	export type ResponseRoles = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof masterDataCollection.roles.all>;
	}>;

	export type ResponseGrade = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof masterDataCollection.grades.all>;
	}>;
}
