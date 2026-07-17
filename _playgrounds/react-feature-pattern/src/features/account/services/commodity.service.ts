import type { QueryClient } from "@tanstack/react-query";
import type { AccountService, TAccountService } from "./account.service";

namespace TCommodityService {
	export type Options = {
		queryClient: QueryClient;
		accountService: AccountService;
	};

	export type ResponseGetUserList = TAccountService.ResponseGetUserList;
}

export class CommodityService {
	private readonly queryClient: QueryClient;
	private readonly accountService: AccountService;

	constructor(opts: TCommodityService.Options) {
		this.queryClient = opts.queryClient;
		this.accountService = opts.accountService;
	}

	queryUserList() {
		return this.queryClient.getQueryData(this.accountService.getUserListOptions().queryKey);
	}

	invalidateUserList() {
		this.accountService.invalidateUserList();
	}

	changeFirstUserName(name: string) {
		this.queryClient.setQueryData(this.accountService.getUserListOptions().queryKey, (data) => {
			return data?.map((user, index) => {
				if (index === 0) {
					return { ...user, name };
				}

				return user;
			});
		});
	}
}
