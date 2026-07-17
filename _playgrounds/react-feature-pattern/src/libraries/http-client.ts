import axios, { type AxiosError, HttpStatusCode } from "axios";

export interface TAxiosResponseData {
	code: number;
	status: string;
	error: string;
	message: string;
	data: Record<string, unknown>;
}

export const httpClient = axios.create({
	// baseURL: process.env.API_BASE_URL,
	timeout: 15_000,
	adapter: "fetch",
	headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
	return config;
});

httpClient.interceptors.response.use(
	(response) => response,
	(error: AxiosError<TAxiosResponseData>): Promise<AxiosError<TAxiosResponseData>> => {
		if (error.response?.data?.code === HttpStatusCode.Unauthorized) {
			window.localStorage.clear();
		}

		return Promise.reject(error);
	},
);
