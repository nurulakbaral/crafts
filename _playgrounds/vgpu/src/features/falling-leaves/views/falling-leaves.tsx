import * as React from "react";
import { clock, draw, effect, frameLoop, init, sampler, surface, target } from "vgpu";
import fallingLeavesShader from "../shaders/falling-leaves.wgsl";
import glassShader from "../shaders/falling-leaves-glass.wgsl";
import noiseShader from "../shaders/falling-leaves-noise.wgsl";
import { FallingLeavesSettings } from "./falling-leaves-settings";

const DEFAULT_GLASS_AMOUNT = 55;
const DEFAULT_LEAF_COUNT = 18;
const DEFAULT_LEAF_SIZE = 100;
const DEFAULT_NOISE_AMOUNT = 12;

type TFallingLeavesProps = React.ComponentPropsWithoutRef<"main">;

function messageFrom(error: unknown) {
	return error instanceof Error ? error.message : "WebGPU could not start this scene.";
}

export function FallingLeaves({ className, ...props }: TFallingLeavesProps) {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const glassLayerRef = React.useRef<ReturnType<typeof effect> | null>(null);
	const leavesRef = React.useRef<ReturnType<typeof draw> | null>(null);
	const noiseLayerRef = React.useRef<ReturnType<typeof effect> | null>(null);
	const settingsRef = React.useRef({
		glassAmount: DEFAULT_GLASS_AMOUNT / 100,
		leafCount: DEFAULT_LEAF_COUNT,
		noiseAmount: DEFAULT_NOISE_AMOUNT / 100,
		sizeScale: DEFAULT_LEAF_SIZE / 100,
	});
	const [glassAmount, setGlassAmount] = React.useState(DEFAULT_GLASS_AMOUNT);
	const [leafCount, setLeafCount] = React.useState(DEFAULT_LEAF_COUNT);
	const [leafSize, setLeafSize] = React.useState(DEFAULT_LEAF_SIZE);
	const [noiseAmount, setNoiseAmount] = React.useState(DEFAULT_NOISE_AMOUNT);
	const [isConfigMinimized, setIsConfigMinimized] = React.useState(false);
	const [renderError, setRenderError] = React.useState<string | null>(null);

	function handleGlassAmountChange(value: number) {
		const amount = value / 100;
		settingsRef.current.glassAmount = amount;
		setGlassAmount(value);
		glassLayerRef.current?.set({ params: { amount } });
	}

	function handleNoiseAmountChange(value: number) {
		const amount = value / 100;
		settingsRef.current.noiseAmount = amount;
		setNoiseAmount(value);
		noiseLayerRef.current?.set({ params: { amount } });
	}

	function handleLeafCountChange(value: number) {
		settingsRef.current.leafCount = value;
		setLeafCount(value);
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
		let glassLayerEffect: ReturnType<typeof effect> | undefined;
		let leavesDraw: ReturnType<typeof draw> | undefined;
		let noiseLayerEffect: ReturnType<typeof effect> | undefined;
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
				const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
				const sceneTarget = target(gpu, { size: canvasSurface.size, label: "falling-leaves.scene" });
				const glassTarget = target(gpu, { size: canvasSurface.size, label: "falling-leaves.glass" });
				const linearSampler = sampler(gpu, { minFilter: "linear", magFilter: "linear" });
				const leaves = draw(gpu, {
					shader: fallingLeavesShader,
					vertices: 6,
					blend: "alpha",
					set: {
						params: {
							time: 0,
							aspect: 1,
							wind: 1,
							sizeScale: settingsRef.current.sizeScale,
						},
					},
				});
				leavesDraw = leaves;
				leavesRef.current = leaves;
				const glassLayer = effect(gpu, glassShader, {
					label: "falling-leaves.glass-layer",
					set: {
						source: sceneTarget,
						sourceSampler: linearSampler,
						params: {
							texelSize: sceneTarget.texelSize,
							amount: settingsRef.current.glassAmount,
							time: 0,
						},
					},
				});
				glassLayerEffect = glassLayer;
				glassLayerRef.current = glassLayer;
				const noiseLayer = effect(gpu, noiseShader, {
					label: "falling-leaves.noise-layer",
					set: {
						source: glassTarget,
						sourceSampler: linearSampler,
						params: {
							resolution: canvasSurface.size,
							time: 0,
							amount: settingsRef.current.noiseAmount,
						},
					},
				});
				noiseLayerEffect = noiseLayer;
				noiseLayerRef.current = noiseLayer;

				unsubscribeResize = canvasSurface.onResize(({ width, height }) => {
					sceneTarget.resize([width, height]);
					glassTarget.resize([width, height]);
					leaves.set({ params: { aspect: width / Math.max(height, 1) } });
					glassLayer.set({ params: { texelSize: sceneTarget.texelSize } });
					noiseLayer.set({ params: { resolution: [width, height] } });
				});

				await Promise.all([
					leaves.compile({ colors: [sceneTarget.format] }),
					glassLayer.compile({ colors: [glassTarget.format] }),
					noiseLayer.compile({ colors: [canvasSurface.format] }),
				]);
				if (cancelled) return;

				const sceneClock = clock(gpu);
				const loop = frameLoop(gpu, (frame) => {
					leaves.set({ params: { time: sceneClock.time } });
					glassLayer.set({ params: { time: sceneClock.time } });
					noiseLayer.set({ params: { time: sceneClock.time } });
					frame.pass({ target: sceneTarget, clear: [1, 1, 1, 1] }, (pass) =>
						pass.draw(leaves, { instances: settingsRef.current.leafCount }),
					);
					frame.pass(glassTarget, glassLayer);
					frame.pass(canvasSurface, noiseLayer);
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
			if (glassLayerRef.current === glassLayerEffect) glassLayerRef.current = null;
			if (leavesRef.current === leavesDraw) leavesRef.current = null;
			if (noiseLayerRef.current === noiseLayerEffect) noiseLayerRef.current = null;
			gpu?.dispose();
		};
	}, []);

	return (
		<main {...props} className={`relative min-h-screen overflow-hidden bg-white ${className ?? ""}`}>
			<canvas ref={canvasRef} aria-label="Animated falling green leaves" className="absolute inset-0 h-full w-full" />
			<FallingLeavesSettings
				glassAmount={glassAmount}
				isMinimized={isConfigMinimized}
				leafCount={leafCount}
				leafSize={leafSize}
				noiseAmount={noiseAmount}
				error={renderError}
				onGlassAmountChange={handleGlassAmountChange}
				onLeafCountChange={handleLeafCountChange}
				onLeafSizeChange={handleLeafSizeChange}
				onNoiseAmountChange={handleNoiseAmountChange}
				onToggle={() => setIsConfigMinimized((current) => !current)}
			/>
		</main>
	);
}
