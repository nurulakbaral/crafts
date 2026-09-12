import * as React from "react";

type TStreamMarkdownChunkConfigProps = {
	chunks: readonly { id: string; value: string }[];
	disabled?: boolean;
	draft: string;
	onAdd: () => void;
	onClear: () => void;
	onDraftChange: (value: string) => void;
	onEdit: (id: string, value: string) => void;
	onRemove: (id: string) => void;
} & Omit<React.HTMLProps<HTMLDivElement>, "onChange">;

export function StreamMarkdownChunkConfig({
	chunks,
	className,
	disabled = false,
	draft,
	onAdd,
	onClear,
	onDraftChange,
	onEdit,
	onRemove,
	...props
}: TStreamMarkdownChunkConfigProps) {
	const [editingChunk, setEditingChunk] = React.useState<{ id: string; value: string }>();
	const hasCustomChunks = chunks.length > 0;
	const inputId = React.useId();

	function saveEditingChunk() {
		if (!editingChunk?.value.length) return;

		onEdit(editingChunk.id, editingChunk.value);
		setEditingChunk(undefined);
	}

	return (
		<div className={`border-b border-zinc-200 bg-zinc-50/70 px-5 py-4 sm:px-6 ${className ?? ""}`} {...props}>
			<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
				<div className="min-w-0 flex-1">
					<div className="mb-2 flex items-center justify-between gap-3">
						<label className="text-xs font-semibold text-zinc-700" htmlFor={inputId}>
							Custom chunk
						</label>
						<span className="text-[11px] text-zinc-400">
							{hasCustomChunks ? `${chunks.length} custom chunks` : "Using default dummy Markdown"}
						</span>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row">
						<textarea
							className="min-h-20 flex-1 resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono text-xs leading-5 text-zinc-800 outline-none transition focus:border-emerald-400 focus:ring-3 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
							disabled={disabled}
							id={inputId}
							onChange={(event) => onDraftChange(event.currentTarget.value)}
							onKeyDown={(event) => {
								if (event.key !== "Enter" || (!event.metaKey && !event.ctrlKey)) return;

								event.preventDefault();
								onAdd();
							}}
							placeholder={"Examples: **hello  or  [docs](https://comark.dev"}
							value={draft}
						/>
						<button
							className="h-10 shrink-0 rounded-xl border border-zinc-950 bg-zinc-950 px-4 text-xs font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 sm:h-20"
							disabled={disabled || draft.length === 0}
							onClick={onAdd}
							type="button"
						>
							Add chunk
						</button>
					</div>
					<p className="mt-2 text-[11px] text-zinc-400">
						Add with Ctrl/⌘ + Enter. Empty list uses the built-in stream.
					</p>
				</div>

				<div className="lg:w-[42%]">
					<div className="mb-2 flex items-center justify-between gap-3">
						<p className="text-xs font-semibold text-zinc-700">Chunk sequence</p>
						<button
							className="text-[11px] font-medium text-zinc-400 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
							disabled={disabled || !hasCustomChunks}
							onClick={() => {
								setEditingChunk(undefined);
								onClear();
							}}
							type="button"
						>
							Clear all
						</button>
					</div>

					{hasCustomChunks ? (
						<ol className="flex max-h-52 flex-col gap-1.5 overflow-auto">
							{chunks.map((chunk, index) => (
								<li
									className="flex items-start gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-2"
									key={chunk.id}
								>
									<span className="mt-0.5 shrink-0 font-mono text-[10px] font-semibold text-emerald-600">
										#{index + 1}
									</span>
									{editingChunk?.id === chunk.id ? (
										<div className="min-w-0 flex-1">
											<textarea
												aria-label={`Edit chunk ${index + 1}`}
												className="min-h-20 w-full resize-y rounded-lg border border-emerald-300 bg-white px-2.5 py-2 font-mono text-[11px] leading-4 text-zinc-700 outline-none ring-3 ring-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
												disabled={disabled}
												onChange={(event) => setEditingChunk({ id: chunk.id, value: event.currentTarget.value })}
												onKeyDown={(event) => {
													if (event.key === "Escape") {
														setEditingChunk(undefined);
														return;
													}

													if (event.key !== "Enter" || (!event.metaKey && !event.ctrlKey)) return;

													event.preventDefault();
													saveEditingChunk();
												}}
												value={editingChunk.value}
											/>
											<div className="mt-2 flex justify-end gap-1.5">
												<button
													className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-zinc-500 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
													disabled={disabled}
													onClick={() => setEditingChunk(undefined)}
													type="button"
												>
													Cancel
												</button>
												<button
													className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
													disabled={disabled || editingChunk.value.length === 0}
													onClick={saveEditingChunk}
													type="button"
												>
													Save
												</button>
											</div>
										</div>
									) : (
										<>
											<pre className="line-clamp-2 min-w-0 flex-1 whitespace-pre-wrap font-mono text-[11px] leading-4 text-zinc-600">
												{chunk.value}
											</pre>
											<button
												aria-label={`Edit chunk ${index + 1}`}
												className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
												disabled={disabled}
												onClick={() => setEditingChunk({ id: chunk.id, value: chunk.value })}
												type="button"
											>
												Edit
											</button>
											<button
												aria-label={`Remove chunk ${index + 1}`}
												className="grid size-5 shrink-0 place-items-center rounded-full text-sm text-zinc-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
												disabled={disabled}
												onClick={() => onRemove(chunk.id)}
												type="button"
											>
												×
											</button>
										</>
									)}
								</li>
							))}
						</ol>
					) : (
						<div className="grid h-20 place-items-center rounded-xl border border-dashed border-zinc-200 bg-white px-4 text-center text-xs text-zinc-400">
							Add one or more chunks to override the default.
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
