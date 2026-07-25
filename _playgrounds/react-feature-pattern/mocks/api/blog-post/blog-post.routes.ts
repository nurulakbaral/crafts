import { utilsApi } from "@mocks/api/api.utils";
import { blogPostCollection } from "@mocks/api/blog-post/blog-post.collection";
import type { TTypesBlogPost } from "@mocks/api/blog-post/blog-post.types";
import { createUrl } from "@mocks/msw.utils";
import { HttpResponse, http } from "msw";

const categoriesRoute = http.get(createUrl("client")("/mock/blog-post/categories"), async () => {
	return HttpResponse.json<TTypesBlogPost.ResponseCategories>({
		code: 200,
		message: "success",
		data: blogPostCollection.categories.all(),
	});
});

const postsRoute = http.get(createUrl("client")("/mock/blog-post/posts"), async ({ request }) => {
	const url = new URL(request.url);
	// @Notes Filtering
	const title = url.searchParams.get("title");
	const description = url.searchParams.get("description");
	const category = url.searchParams.get("category");
	const published_at = url.searchParams.get("published_at");
	const author = url.searchParams.get("author");
	// @Notes Searching
	const query = url.searchParams.get("query");
	const search = url.searchParams.get("search");
	// @Notes Pagination
	const page = Number(url.searchParams.get("page")) || 1;
	const limit = Number(url.searchParams.get("limit")) || 10;

	if (query) {
		return HttpResponse.json<TTypesBlogPost.ResponseBlogs>({
			code: 200,
			message: "success",
			total: blogPostCollection.posts.count(),
			page,
			limit,
			data: blogPostCollection.posts.findMany(($) =>
				$.or({ title: (prop) => !query || prop.toLowerCase().startsWith(query.toLowerCase()) }).or({
					description: (prop) => !query || prop.toLowerCase().startsWith(query.toLowerCase()),
				}),
			),
		});
	}

	return HttpResponse.json<TTypesBlogPost.ResponseBlogs>({
		code: 200,
		message: "success",
		total: blogPostCollection.posts.count(),
		page,
		limit,
		data: blogPostCollection.posts.findMany(
			(query) =>
				query
					// @Notes Searching
					.or({ title: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) })
					.or({ description: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) })
					.or({ category: { value: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) } })
					.or({ author: { name: (prop) => !search || prop.toLowerCase().startsWith(search.toLowerCase()) } })
					// @Notes Filtering
					.and({ title: (prop) => !title || prop.toLowerCase().startsWith(title.toLowerCase()) })
					.and({ description: (prop) => !description || prop.toLowerCase().startsWith(description.toLowerCase()) })
					.and({ category: { value: (prop) => !category || category.split(",").includes(prop) } })
					.and({ published_at: (prop) => !published_at || utilsApi.rangeDate(published_at, prop) })
					.and({ author: { name: (prop) => !author || prop.toLowerCase().startsWith(author.toLowerCase()) } }),
			{
				skip: (page - 1) * limit,
				take: limit,
			},
		),
	});
});

// ------------------------------------------------------------------------------------------
// @Router
// ------------------------------------------------------------------------------------------

export const blogPostRouter = [postsRoute, categoriesRoute];
