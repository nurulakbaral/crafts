import type { TTypesMsw } from "@mocks/msw.types";
import type { templateCollection } from "./template.collection";

export namespace TTypesTemplate {
	export type ResponseTemplate = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof templateCollection.posts.findFirst>;
		total: number;
		page: number;
		limit: number;
	}>;

	export type ResponseTemplateList = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof templateCollection.posts.all>;
		total: number;
		page: number;
		limit: number;
	}>;
}
