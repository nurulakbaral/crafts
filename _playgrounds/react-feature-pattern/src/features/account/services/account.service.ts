import { type QueryClient, queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosInstance } from "axios";

export namespace TAccountService {
	export type Options = {
		httpClient: AxiosInstance;
		queryClient: QueryClient;
	};

	export type ResponseGetUserList = Array<{ id: number; name: string; username: string; email: string }>;
}

export class AccountService {
	private readonly httpClient: AxiosInstance;
	private readonly queryClient: QueryClient;

	constructor(opts: TAccountService.Options) {
		this.httpClient = opts.httpClient;
		this.queryClient = opts.queryClient;
	}

	invalidateUserList() {
		this.queryClient.invalidateQueries({ queryKey: ["user", "list"] });
	}

	getUserListOptions() {
		return queryOptions({
			queryKey: ["user", "list"],
			queryFn: async () => {
				const response = await this.httpClient.get<TAccountService.ResponseGetUserList>(
					"https://jsonplaceholder.typicode.com/users",
				);

				return response.data;
			},
		});
	}

	useUserList() {
		return useQuery(this.getUserListOptions());
	}
}
