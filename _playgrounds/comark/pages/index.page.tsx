import { StreamMarkdown } from "~/components/stream-markdown";

export default function App() {
	return (
		<main className="min-h-dvh bg-[#f7f7f5] text-zinc-950">
			<div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between border-b border-zinc-200 pb-5">
					<a className="flex items-center gap-2 font-semibold tracking-tight" href="/" aria-label="Comark stream home">
						<span className="grid size-8 place-items-center rounded-lg bg-zinc-950 text-sm text-white">C</span>
						<span>Comark Stream</span>
					</a>
					<a
						className="text-sm text-zinc-500 transition-colors hover:text-zinc-950"
						href="https://comark.dev"
						rel="noreferrer"
						target="_blank"
					>
						comark.dev ↗
					</a>
				</nav>

				<section className="py-12 sm:py-16">
					<p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">
						Streaming playground
					</p>
					<h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl">
						Parse Markdown at the speed it arrives.
					</h1>
					<p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
						A cancellable server-stream simulation rendered frame by frame with Comark. Compare each incoming raw chunk
						with the rendered document it produces, even when that chunk ends mid-token.
					</p>
				</section>

				<StreamMarkdown />

				<footer className="flex flex-col gap-2 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
					<p>Built with React, ReadableStream, and Comark.</p>
					<a
						className="hover:text-zinc-950"
						href="https://comark.dev/reference/auto-close"
						rel="noreferrer"
						target="_blank"
					>
						Read the streaming API docs ↗
					</a>
				</footer>
			</div>
		</main>
	);
}
