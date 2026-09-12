import { MarkdownDocument } from "@comark/react";
import { createMarkdownParser, type MarkdownDocument as TMarkdownDocument } from "comark";
import * as React from "react";
import { StreamMarkdownChunkConfig } from "~/components/stream-markdown-chunk-config";
import { streamMarkdownFromServer } from "~/utils/stream-markdown";

type TStreamStatus = "complete" | "error" | "idle" | "paused" | "stopped" | "streaming";
type TStreamSpeed = "fast" | "normal" | "slow";
type TMarkdownChunk = {
	id: string;
	value: string;
};
type TPauseGate = {
	promise: Promise<void>;
	resume: () => void;
};

const StreamSpeeds: Record<TStreamSpeed, number> = {
	fast: 100,
	normal: 350,
	slow: 800,
};

const StatusLabels: Record<TStreamStatus, string> = {
	complete: "Complete",
	error: "Failed",
	idle: "Ready",
	paused: "Paused",
	stopped: "Stopped",
	streaming: "Streaming",
};

function isAbortError(error: unknown) {
	return error instanceof DOMException && error.name === "AbortError";
}

function createPauseGate(): TPauseGate {
	let resume: () => void = () => undefined;
	const promise = new Promise<void>((resolve) => {
		resume = resolve;
	});

	return { promise, resume };
}

// ------------------------------------------------------------------------------------------
// Stream Button
// ------------------------------------------------------------------------------------------

type TStreamButtonProps = React.ComponentProps<"button"> & {
	variant?: "primary" | "secondary" | "danger";
};

function StreamButton({ className, variant = "secondary", ...props }: TStreamButtonProps) {
	const Variants = {
		danger: "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100",
		primary: "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800",
		secondary: "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
	};

	return (
		<button
			className={`inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${Variants[variant]} ${className ?? ""}`}
			type="button"
			{...props}
		/>
	);
}

// ==========================================================================================
// @Main — Stream Markdown
// ==========================================================================================

const parse = createMarkdownParser();

type TStreamMarkdownProps = React.HTMLProps<HTMLElement>;

export function StreamMarkdown({ className, ...props }: TStreamMarkdownProps) {
	const [chunks, setChunks] = React.useState<TMarkdownChunk[]>([]);
	const [document, setDocument] = React.useState<TMarkdownDocument>();
	const [draftChunk, setDraftChunk] = React.useState("");
	const [errorMessage, setErrorMessage] = React.useState("");
	const [latestChunk, setLatestChunk] = React.useState("");
	const [markdown, setMarkdown] = React.useState("");
	const [speed, setSpeed] = React.useState<TStreamSpeed>("normal");
	const [status, setStatus] = React.useState<TStreamStatus>("idle");
	const abortController = React.useRef<AbortController>(null);
	const chunkNumber = React.useRef(0);
	const pauseGate = React.useRef<TPauseGate>(null);
	const runNumber = React.useRef(0);

	const startStream = React.useCallback(async () => {
		const currentRun = runNumber.current + 1;
		runNumber.current = currentRun;
		pauseGate.current?.resume();
		pauseGate.current = null;
		abortController.current?.abort();

		const controller = new AbortController();
		abortController.current = controller;

		setDocument(undefined);
		setErrorMessage("");
		setLatestChunk("");
		setMarkdown("");
		setStatus("streaming");
		chunkNumber.current = 0;

		try {
			const completedSource = await streamMarkdownFromServer({
				chunks: chunks.map((chunk) => chunk.value),
				delayInMilliseconds: StreamSpeeds[speed],
				signal: controller.signal,
				onChunk: async (source, chunk) => {
					if (runNumber.current !== currentRun) return;

					chunkNumber.current += 1;
					setLatestChunk(chunk);
					setMarkdown(source);
					const nextDocument = await parse(source, { streaming: true });

					if (runNumber.current === currentRun) setDocument(nextDocument);
				},
				waitUntilResumed: async () => {
					await pauseGate.current?.promise;
				},
			});

			const completedDocument = await parse(completedSource);
			if (runNumber.current !== currentRun) return;

			setDocument(completedDocument);
			setStatus("complete");
		} catch (error) {
			if (runNumber.current !== currentRun) return;

			if (isAbortError(error)) {
				setStatus("stopped");
				return;
			}

			setErrorMessage(error instanceof Error ? error.message : "The stream failed unexpectedly.");
			setStatus("error");
		}
	}, [chunks, speed]);

	const togglePause = React.useCallback(() => {
		if (status === "streaming") {
			pauseGate.current = createPauseGate();
			setStatus("paused");
			return;
		}

		if (status === "paused") {
			pauseGate.current?.resume();
			pauseGate.current = null;
			setStatus("streaming");
		}
	}, [status]);

	const stopStream = React.useCallback(() => {
		if (!abortController.current || abortController.current.signal.aborted) return;

		pauseGate.current?.resume();
		pauseGate.current = null;
		abortController.current.abort();
		setStatus("stopped");
	}, []);

	React.useEffect(() => {
		return () => {
			runNumber.current += 1;
			pauseGate.current?.resume();
			abortController.current?.abort();
		};
	}, []);

	const isStreaming = status === "streaming";
	const isActive = isStreaming || status === "paused";
	const characterCount = new Intl.NumberFormat("en").format(markdown.length);
	const latestChunkSize = new TextEncoder().encode(latestChunk).length;
	const startButtonLabel = status === "idle" ? "Start" : "Retry";

	function addChunk() {
		if (!draftChunk.length || isActive) return;

		setChunks((currentChunks) => [...currentChunks, { id: crypto.randomUUID(), value: draftChunk }]);
		setDraftChunk("");
	}

	return (
		<section
			className={`overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-[0_24px_80px_-32px_rgba(24,24,27,0.2)] ${className ?? ""}`}
			{...props}
		>
			<header className="flex flex-col gap-4 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<div className="flex items-center gap-3">
					<span
						aria-hidden="true"
						className={`size-2.5 rounded-full ${isStreaming ? "animate-pulse bg-emerald-500" : status === "error" ? "bg-red-500" : "bg-zinc-300"}`}
					/>
					<div>
						<p className="text-sm font-semibold text-zinc-950">Server response</p>
						<p aria-live="polite" className="text-xs text-zinc-500">
							{StatusLabels[status]} · {chunkNumber.current} chunks · {characterCount} characters
						</p>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<label className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white py-1 pr-2 pl-3 text-xs font-medium text-zinc-500">
						<span>Speed</span>
						<select
							aria-label="Stream speed"
							className="cursor-pointer bg-transparent text-sm font-semibold text-zinc-800 outline-none disabled:cursor-not-allowed disabled:opacity-50"
							disabled={isActive}
							onChange={(event) => setSpeed(event.currentTarget.value as TStreamSpeed)}
							value={speed}
						>
							<option value="slow">Slow · 800ms</option>
							<option value="normal">Normal · 350ms</option>
							<option value="fast">Fast · 100ms</option>
						</select>
					</label>
					<StreamButton disabled={isActive} onClick={() => void startStream()} variant="primary">
						{startButtonLabel}
					</StreamButton>
					<StreamButton disabled={!isActive} onClick={togglePause}>
						{status === "paused" ? "Continue" : "Pause"}
					</StreamButton>
					<StreamButton disabled={!isActive} onClick={stopStream} variant="danger">
						Stop
					</StreamButton>
				</div>
			</header>

			<StreamMarkdownChunkConfig
				chunks={chunks}
				disabled={isActive}
				draft={draftChunk}
				onAdd={addChunk}
				onClear={() => setChunks([])}
				onDraftChange={setDraftChunk}
				onEdit={(id, value) =>
					setChunks((currentChunks) => currentChunks.map((chunk) => (chunk.id === id ? { ...chunk, value } : chunk)))
				}
				onRemove={(id) => setChunks((currentChunks) => currentChunks.filter((chunk) => chunk.id !== id))}
			/>

			{errorMessage ? (
				<p className="border-b border-red-100 bg-red-50 px-6 py-3 text-sm text-red-700" role="alert">
					{errorMessage}
				</p>
			) : null}

			<div className="grid min-h-136 md:grid-cols-2">
				<div className="border-b border-zinc-200 bg-zinc-950 md:border-r md:border-b-0">
					<div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-xs font-medium text-zinc-400">
						<span>Raw chunk</span>
						<span>{chunkNumber.current ? `#${chunkNumber.current} · ${latestChunkSize} bytes` : "Waiting"}</span>
					</div>
					<div className="h-128 overflow-auto p-5 sm:p-6">
						{latestChunk ? (
							<div className="rounded-xl border border-white/10 bg-white/4 p-4">
								<p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
									Chunk {chunkNumber.current}
								</p>
								<pre className="whitespace-pre-wrap font-mono text-[13px] leading-6 text-zinc-200">{latestChunk}</pre>
							</div>
						) : (
							<div className="grid h-full place-items-center text-center">
								<div>
									<p className="font-mono text-sm text-zinc-500">Waiting for the first chunk…</p>
									<p className="mt-2 text-xs text-zinc-700">Press Start to open the stream.</p>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="bg-white">
					<div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 text-xs font-medium text-zinc-500">
						<span>Rendered frame</span>
						<span>{chunkNumber.current ? `After chunk #${chunkNumber.current}` : "Comark"}</span>
					</div>
					<div className="h-128 overflow-auto p-6 sm:p-8" aria-live="polite">
						{document ? (
							<MarkdownDocument
								caret={isStreaming ? { class: "stream-markdown-caret" } : false}
								className="stream-markdown-output"
								streaming={isStreaming}
								value={document}
							/>
						) : (
							<div className="grid h-full place-items-center text-center">
								<div>
									<div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl border border-zinc-200 bg-zinc-50 text-xl">
										M↓
									</div>
									<p className="text-sm font-medium text-zinc-700">Your rendered document will appear here.</p>
									<p className="mt-1 text-xs text-zinc-400">Incomplete Markdown stays readable as it streams.</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
