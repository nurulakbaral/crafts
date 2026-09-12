const DefaultMarkdownChunks = [
	"# Markdown that keeps up\n\n",
	"This response is arriving from a **simu",
	"lated server** as a sequence of small byte chunks. ",
	"Comark repairs incomplete syntax on every frame, so the preview never exposes half-finished markup.\n\n",
	"> The transport is mocked locally, but it uses the same `Response.body` reader you would use with a real endpoint.\n\n",
	"## What the stream demonstrates\n\n",
	"- [x] Incremental Markdown parsing\n",
	"- [x] Clean handling of **bold**, _emphasis_, and [`links`](https://comark.dev)\n",
	"- [x] An animated caret while content is arriving\n",
	"- [x] Abort support for the **Stop** control\n",
	"- [x] A fresh request when you press **Retry**\n\n",
	"## A code block in flight\n\n",
	"```ts\n",
	'const response = await fetch("/api/markdown")\n',
	"const reader = response.body?.getReader()\n\n",
	"while (reader) {\n",
	"  const { done, value } = await reader.read()\n",
	"  if (done) break\n",
	"  render(decoder.decode(value, { stream: true }))\n",
	"}\n",
	"```\n\n",
	"## Stream state\n\n",
	"| Capability | Result |\n",
	"| --- | --- |\n",
	"| Partial tokens | Auto-closed |\n",
	"| Cancellation | AbortSignal |\n",
	"| Restart | New response |\n\n",
	"The stream is complete — and the final document is rendered without streaming helpers.",
] as const;

const DefaultChunkDelayInMilliseconds = 350;

type TStreamMarkdownFromServerOptions = {
	chunks?: readonly string[];
	delayInMilliseconds?: number;
	signal: AbortSignal;
	onChunk: (markdown: string, chunk: string) => Promise<void> | void;
	waitUntilResumed?: () => Promise<void>;
};

function createAbortError() {
	return new DOMException("The markdown stream was stopped.", "AbortError");
}

function waitForChunk(signal: AbortSignal, delayInMilliseconds: number) {
	return new Promise<void>((resolve, reject) => {
		if (signal.aborted) {
			reject(createAbortError());
			return;
		}

		const onAbort = () => {
			clearTimeout(timeout);
			reject(createAbortError());
		};
		const timeout = window.setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, delayInMilliseconds);

		signal.addEventListener("abort", onAbort, { once: true });
	});
}

function createDummyMarkdownResponse(signal: AbortSignal, delayInMilliseconds: number, chunks: readonly string[]) {
	const encoder = new TextEncoder();
	let chunkIndex = 0;

	const body = new ReadableStream<Uint8Array>({
		async pull(controller) {
			try {
				await waitForChunk(signal, delayInMilliseconds);

				const chunk = chunks[chunkIndex];
				if (chunk === undefined) {
					controller.close();
					return;
				}

				controller.enqueue(encoder.encode(chunk));
				chunkIndex += 1;
			} catch (error) {
				controller.error(error);
			}
		},
	});

	return new Response(body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Transfer-Encoding": "chunked",
		},
	});
}

export async function streamMarkdownFromServer({
	chunks,
	delayInMilliseconds = DefaultChunkDelayInMilliseconds,
	signal,
	onChunk,
	waitUntilResumed,
}: TStreamMarkdownFromServerOptions) {
	const responseChunks = chunks?.length ? chunks : DefaultMarkdownChunks;
	const response = createDummyMarkdownResponse(signal, Math.max(0, delayInMilliseconds), responseChunks);
	const reader = response.body?.getReader();

	if (!response.ok || !reader) {
		throw new Error("The markdown stream could not be opened.");
	}

	const decoder = new TextDecoder();
	let markdown = "";

	while (true) {
		const { done, value } = await reader.read();
		await waitUntilResumed?.();
		signal.throwIfAborted();
		if (done) break;

		const chunk = decoder.decode(value, { stream: true });
		markdown += chunk;
		await onChunk(markdown, chunk);
	}

	markdown += decoder.decode();
	return markdown;
}
