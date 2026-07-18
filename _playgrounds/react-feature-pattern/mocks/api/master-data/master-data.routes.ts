import { masterDataCollection } from "@mocks/api/master-data/master-data.collection";
import { createUrl } from "@mocks/msw.utils";
import { HttpResponse, http } from "msw";
import type { TTypesMasterData } from "./master-data.types";

const gradeRoute = http.get(createUrl("client")("/mock/master-data/grade"), () => {
	return HttpResponse.json<TTypesMasterData.ResponseGrade>({
		code: 200,
		message: "success",
		data: masterDataCollection.grades.all(),
	});
});

const statusRoute = http.get(createUrl("client")("/mock/master-data/status"), () => {
	return HttpResponse.json<TTypesMasterData.ResponseStatus>({
		code: 200,
		message: "success",
		data: masterDataCollection.status.all(),
	});
});

const rolesRoute = http.get(createUrl("client")("/mock/master-data/roles"), () => {
	return HttpResponse.json<TTypesMasterData.ResponseRoles>({
		code: 200,
		message: "success",
		data: masterDataCollection.roles.all(),
	});
});

const projectsRoute = http.get(createUrl("client")("/mock/master-data/projects"), () => {
	return HttpResponse.json<TTypesMasterData.ResponseProjects>({
		code: 200,
		message: "success",
		data: masterDataCollection.projects.all(),
	});
});

// ------------------------------------------------------------------------------------------
// @Router
// ------------------------------------------------------------------------------------------

export const masterDataRouter = [gradeRoute, statusRoute, rolesRoute, projectsRoute];
