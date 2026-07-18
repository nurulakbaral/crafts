import { templateCollection } from "@mocks/api/__template__/template.collection";
import type { TTypesTemplate } from "@mocks/api/__template__/template.types";
import { createUrl } from "@mocks/msw.utils";
import { HttpResponse, http } from "msw";

const templateRoute = http.get<{ id: string }>(createUrl("client")("/mock/template/:id"), ({ params }) => {
	const _templateId = params.id;

	return HttpResponse.json<TTypesTemplate.ResponseTemplate>({
		code: 200,
		message: "success",
		data: templateCollection.posts.findFirst((q) => q.where({ title: "" })),
		total: 10,
		page: 1,
		limit: 10,
	});
});

const templateListRoute = http.get(createUrl("client")("/mock/template/list"), ({ request }) => {
	const url = new URL(request.url);
	const _page = url.searchParams.get("page");
	const _limit = url.searchParams.get("limit");

	return HttpResponse.json<TTypesTemplate.ResponseTemplateList>({
		code: 200,
		message: "success",
		data: templateCollection.posts.all(),
		total: 10,
		page: 1,
		limit: 10,
	});
});

// ------------------------------------------------------------------------------------------
// @Router
// ------------------------------------------------------------------------------------------

export const templateRouter = [templateListRoute, templateRoute];
