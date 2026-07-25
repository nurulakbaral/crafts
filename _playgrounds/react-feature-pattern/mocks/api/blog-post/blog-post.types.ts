import type { TTypesMsw } from "@mocks/msw.types";
import type { blogPostCollection } from "./blog-post.collection";

export namespace TTypesBlogPost {
	export type ResponseCategories = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof blogPostCollection.categories.all>;
	}>;

	export type ResponseBlogs = TTypesMsw.JsonBodyType<{
		data: ReturnType<typeof blogPostCollection.posts.all>;
		total: number;
		page: number;
		limit: number;
	}>;
}
