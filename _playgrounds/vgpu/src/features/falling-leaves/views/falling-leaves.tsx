import * as React from "react";
import { clock, effect, frameLoop, init, surface } from "vgpu";

import fallingLeavesShader from "../shaders/falling-leaves.wgsl";

const DEFAULT_LEAF_COUNT = 18;
const DEFAULT_LEAF_SIZE = 100;

type TLeafSettingsProps = {
	isMinimized: boolean;
	leafCount: number;
	leafSize: number;
	error: string | null;
	onLeafCountChange: (value: number) => void;
	onLeafSizeChange: (value: number) => void;
	onToggle: () => void;
} & Omit<React.ComponentPropsWithoutRef<"aside">, "children">;

type TFallingLeavesProps = React.ComponentPropsWithoutRef<"main">;

function messageFrom(error: unknown) {
	return error instanceof Error ? error.message : "WebGPU could not start this scene.";
}

function LeafSettings({
	isMinimized,
	leafCount,
	leafSize,
	error,
	onLeafCountChange,
	onLeafSizeChange,
	onToggle,
	className,
	...props
}: TLeafSettingsProps) {
	if (isMinimized) {
		return (
			<aside
				{...props}
				className={`absolute right-4 top-4 z-10 rounded-2xl border border-emerald-900/10 bg-white/90 p-1.5 shadow-lg backdrop-blur ${className ?? ""}`}
			>
				<button
					type="button"
					aria-label="Maximize leaf settings"
					aria-expanded="false"
					className="grid size-10 place-items-center rounded-xl text-emerald-800 transition hover:bg-emerald-50"
					onClick={onToggle}
				>
					<svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
						<path
							d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="1.8"
						/>
					</svg>
				</button>
			</aside>
		);
	}

	return (
		<aside
			{...props}
			className={`absolute right-4 top-4 z-10 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-emerald-900/10 bg-white/92 p-5 text-slate-900 shadow-xl shadow-emerald-950/10 backdrop-blur-md ${className ?? ""}`}
		>
			<header className="flex items-start justify-between gap-4">
				<div>
					<p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">Leaf scene</p>
					<h1 className="mt-1 text-lg font-semibold tracking-tight">Configuration</h1>
				</div>
				<button
					type="button"
					aria-label="Minimize leaf settings"
					aria-expanded="true"
					className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
					onClick={onToggle}
				>
					<svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
						<path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
					</svg>
				</button>
			</header>

			<div className="mt-6 space-y-5">
				<div>
					<label className="flex items-center justify-between text-sm font-medium" htmlFor="leaf-count">
						<span>Leaves</span>
						<output
							className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-800"
							htmlFor="leaf-count"
						>
							{leafCount}
						</output>
					</label>
					<input
						id="leaf-count"
						type="range"
						min="6"
						max="36"
						step="1"
						value={leafCount}
						className="mt-3 h-1.5 w-full cursor-pointer accent-emerald-600"
						onChange={(event) => onLeafCountChange(Number(event.currentTarget.value))}
					/>
				</div>

				<div>
					<label className="flex items-center justify-between text-sm font-medium" htmlFor="leaf-size">
						<span>Leaf size</span>
						<output
							className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-800"
							htmlFor="leaf-size"
						>
							{leafSize}%
						</output>
					</label>
					<input
						id="leaf-size"
						type="range"
						min="60"
						max="160"
						step="5"
						value={leafSize}
						className="mt-3 h-1.5 w-full cursor-pointer accent-emerald-600"
						onChange={(event) => onLeafSizeChange(Number(event.currentTarget.value))}
					/>
				</div>
			</div>

			{error ? <p className="mt-5 border-t border-rose-100 pt-4 text-xs leading-5 text-rose-700">{error}</p> : null}
		</aside>
	);
}

export function FallingLeaves({ className, ...props }: TFallingLeavesProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const leavesRef = React.useRef<ReturnType<typeof effect> | null>(null);
	const settingsRef = React.useRef({ leafCount: DEFAULT_LEAF_COUNT, sizeScale: DEFAULT_LEAF_SIZE / 100 });
	const [leafCount, setLeafCount] = React.useState(DEFAULT_LEAF_COUNT);
	const [leafSize, setLeafSize] = React.useState(DEFAULT_LEAF_SIZE);
	const [isConfigMinimized, setIsConfigMinimized] = React.useState(false);
	const [renderError, setRenderError] = React.useState<string | null>(null);

	function handleLeafCountChange(value: number) {
		settingsRef.current.leafCount = value;
		setLeafCount(value);
		leavesRef.current?.set({ params: { leafCount: value } });
	}

	function handleLeafSizeChange(value: number) {
		const sizeScale = value / 100;
		settingsRef.current.sizeScale = sizeScale;
		setLeafSize(value);
		leavesRef.current?.set({ params: { sizeScale } });
	}

	React.useEffect(() => {
		let cancelled = false;
		let stopLoop: (() => void) | undefined;
		let unsubscribeResize: (() => void) | undefined;
		let leavesEffect: ReturnType<typeof effect> | undefined;
		let gpu: Awaited<ReturnType<typeof init>> | undefined;

		async function start() {
			try {
				const canvas = canvasRef.current;
				if (!canvas) return;

				const nextGpu = await init();
				if (cancelled) {
					nextGpu.dispose();
					return;
				}

				gpu = nextGpu;
				const target = surface(gpu, canvas, { dpr: [1, 2] });
				const leaves = effect(gpu, fallingLeavesShader, {
					set: {
						params: {
							time: 0,
							aspect: 1,
							wind: 1,
							sizeScale: settingsRef.current.sizeScale,
							leafCount: settingsRef.current.leafCount,
							padding0: 0,
							padding1: 0,
							padding2: 0,
						},
					},
				});
				leavesEffect = leaves;
				leavesRef.current = leaves;

				unsubscribeResize = target.onResize(({ width, height }) => {
					leaves.set({ params: { aspect: width / Math.max(height, 1) } });
				});

				await leaves.compile({ colors: [target.format] });
				if (cancelled) return;

				const sceneClock = clock(gpu);
				const loop = frameLoop(gpu, (frame) => {
					leaves.set({ params: { time: sceneClock.time } });
					frame.pass(target, leaves);
				});
				stopLoop = () => loop.stop();
			} catch (error) {
				if (!cancelled) setRenderError(messageFrom(error));
			}
		}

		void start();

		return () => {
			cancelled = true;
			stopLoop?.();
			unsubscribeResize?.();
			if (leavesRef.current === leavesEffect) leavesRef.current = null;
			gpu?.dispose();
		};
	}, []);

	return (
		<main {...props} className={`relative min-h-screen overflow-hidden bg-white ${className ?? ""}`}>
			<canvas ref={canvasRef} aria-label="Animated falling green leaves" className="absolute inset-0 h-full w-full" />
			<LeafSettings
				isMinimized={isConfigMinimized}
				leafCount={leafCount}
				leafSize={leafSize}
				error={renderError}
				onLeafCountChange={handleLeafCountChange}
				onLeafSizeChange={handleLeafSizeChange}
				onToggle={() => setIsConfigMinimized((current) => !current)}
			/>
		</main>
	);
}
