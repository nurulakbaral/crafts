import { QueryClient } from "@tanstack/react-query";
import { asClass, asValue, createContainer, InjectionMode } from "awilix";
import type { AxiosInstance } from "axios";
import { AccountService } from "~/features/account/services/account.service";
import { CommodityService } from "~/features/account/services/commodity.service";
import { httpClient } from "~/libraries/http-client";

// ------------------------------------------------------------------------------------------
// @Main - App Container
// ------------------------------------------------------------------------------------------

namespace TAppContainer {
	export type Configs = {
		httpClient: AxiosInstance;
		queryClient: QueryClient;
	};

	export type AccountServices = {
		accountService: AccountService;
		commodityService: CommodityService;
	};
}

export const appContainer = createContainer<TAppContainer.Configs & TAppContainer.AccountServices>({
	injectionMode: InjectionMode.PROXY,
	strict: true,
});

/**
 * Configs
 */

appContainer.register({
	httpClient: asValue(httpClient),
	queryClient: asValue(new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })),
});

/**
 * Account Services
 */

appContainer.register({
	accountService: asClass(AccountService).singleton(),
	commodityService: asClass(CommodityService).singleton(),
});
