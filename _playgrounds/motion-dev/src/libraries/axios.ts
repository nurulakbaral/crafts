import axios from "axios";

export const httpRequest = axios.create({
	baseURL: "http://localhost:3000",
	timeout: 50_000,
	adapter: "fetch",
});
