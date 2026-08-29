import * as React from "react";
import { clock, effect, frameLoop, init, surface } from "vgpu";

import fallingLeavesShader from "../shaders/falling-leaves.wgsl";

type TFallingLeavesProps = React.ComponentPropsWithoutRef<"main">;

function messageFrom(error: unknown) {
	return error instanceof Error ? error.message : "WebGPU could not start this scene.";
}

export function FallingLeaves({ className, ...props }: TFallingLeavesProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const [renderError, setRenderError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let cancelled = false;
		let stopLoop: (() => void) | undefined;
		let unsubscribeResize: (() => void) | undefined;
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
						params: { time: 0, aspect: 1, wind: 1, padding: 0 },
					},
				});

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
			gpu?.dispose();
		};
	}, []);

	return (
		<main {...props} className={`relative min-h-screen overflow-hidden bg-[#071923] text-white ${className ?? ""}`}>
			<canvas ref={canvasRef} aria-label="Animated falling autumn leaves" className="absolute inset-0 h-full w-full" />

			<div className="pointer-events-none relative z-10 flex min-h-screen items-end p-6 sm:p-10">
				<div className="max-w-sm border-l border-amber-200/45 pl-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
					<p className="text-xs font-semibold tracking-[0.32em] text-amber-100/85">AUTUMN STUDY</p>
					<h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Falling leaves</h1>
					<p className="mt-3 text-sm leading-6 text-amber-50/80">
						A procedural WebGPU scene, drifting with the evening wind.
					</p>
				</div>
			</div>

			{renderError ? (
				<div
					className="absolute inset-x-6 top-6 z-20 max-w-lg rounded-lg border border-rose-200/30 bg-slate-950/75 p-4 text-sm text-rose-100 backdrop-blur"
					role="alert"
				>
					<strong className="block font-semibold">This browser cannot render the WebGPU scene.</strong>
					<span className="mt-1 block text-rose-100/80">{renderError}</span>
				</div>
			) : null}
		</main>
	);
}
