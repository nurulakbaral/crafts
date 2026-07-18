export async function listenAndServeMocks() {
	if (process.env.NODE_ENV !== "development") {
		return;
	}

	if (typeof window === "undefined") {
		const node = await import("./msw.node");
		node.server.listen();

		return;
	}

	const { worker } = await import("./msw.browser");

	return worker.start({ onUnhandledRequest: "bypass" });
}
