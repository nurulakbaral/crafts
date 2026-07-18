export function createUrl(env: "client" | "server") {
	return (endpoint: string) => {
		if (env === "client") {
			return endpoint;
		}

		// @Notes Currently, we don't need to import the worker (Node.js) because we are using the worker in the browser.
		// @Docs https://mswjs.io/docs/integrations/node
		if (env === "server") {
			// @Notes Handle the case where route name is not properly formatted.
			return endpoint;
		}

		return endpoint;
	};
}
