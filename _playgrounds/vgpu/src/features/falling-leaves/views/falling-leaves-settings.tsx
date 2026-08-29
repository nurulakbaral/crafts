import type * as React from "react";

type TFallingLeavesSettingsProps = {
	error: string | null;
	glassAmount: number;
	isMinimized: boolean;
	leafCount: number;
	leafSize: number;
	noiseAmount: number;
	onGlassAmountChange: (value: number) => void;
	onLeafCountChange: (value: number) => void;
	onLeafSizeChange: (value: number) => void;
	onNoiseAmountChange: (value: number) => void;
	onToggle: () => void;
} & Omit<React.ComponentPropsWithoutRef<"aside">, "children">;

type TRangeSettingProps = {
	id: string;
	label: string;
	max: number;
	min: number;
	step: number;
	unit?: string;
	value: number;
	onChange: (value: number) => void;
};

function RangeSetting({ id, label, max, min, step, unit = "", value, onChange }: TRangeSettingProps) {
	return (
		<div>
			<label className="flex items-center justify-between text-sm font-medium" htmlFor={id}>
				<span>{label}</span>
				<output className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-800" htmlFor={id}>
					{value}
					{unit}
				</output>
			</label>
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				className="mt-3 h-1.5 w-full cursor-pointer accent-emerald-600"
				onChange={(event) => onChange(Number(event.currentTarget.value))}
			/>
		</div>
	);
}

export function FallingLeavesSettings({
	error,
	glassAmount,
	isMinimized,
	leafCount,
	leafSize,
	noiseAmount,
	onGlassAmountChange,
	onLeafCountChange,
	onLeafSizeChange,
	onNoiseAmountChange,
	onToggle,
	className,
	...props
}: TFallingLeavesSettingsProps) {
	if (isMinimized) {
		return (
			<aside
				{...props}
				className={`absolute right-4 top-4 z-10 rounded-2xl border border-emerald-900/10 bg-white/90 p-1.5 shadow-lg backdrop-blur ${className ?? ""}`}
			>
				<button
					type="button"
					aria-label="Maximize scene settings"
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
			className={`absolute right-4 top-4 z-10 max-h-[calc(100vh-2rem)] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-emerald-900/10 bg-white/92 p-5 text-slate-900 shadow-xl shadow-emerald-950/10 backdrop-blur-md ${className ?? ""}`}
		>
			<header className="flex items-start justify-between gap-4">
				<div>
					<p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">Leaf scene</p>
					<h1 className="mt-1 text-lg font-semibold tracking-tight">Configuration</h1>
				</div>
				<button
					type="button"
					aria-label="Minimize scene settings"
					aria-expanded="true"
					className="grid size-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
					onClick={onToggle}
				>
					<svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
						<path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
					</svg>
				</button>
			</header>

			<section className="mt-6 space-y-5" aria-labelledby="scene-settings-title">
				<h2
					id="scene-settings-title"
					className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400"
				>
					Scene
				</h2>
				<RangeSetting
					id="leaf-count"
					label="Leaves"
					min={6}
					max={36}
					step={1}
					value={leafCount}
					onChange={onLeafCountChange}
				/>
				<RangeSetting
					id="leaf-size"
					label="Leaf size"
					min={60}
					max={160}
					step={5}
					unit="%"
					value={leafSize}
					onChange={onLeafSizeChange}
				/>
			</section>

			<section className="mt-6 space-y-5 border-t border-slate-100 pt-5" aria-labelledby="layer-settings-title">
				<div>
					<h2
						id="layer-settings-title"
						className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-400"
					>
						Layer stack
					</h2>
					<p className="mt-1 text-xs leading-5 text-slate-500">Full-window effects, rendered in order.</p>
				</div>
				<RangeSetting
					id="glass-amount"
					label="Liquid glass"
					min={0}
					max={100}
					step={1}
					unit="%"
					value={glassAmount}
					onChange={onGlassAmountChange}
				/>
				<RangeSetting
					id="noise-amount"
					label="Pixel noise"
					min={0}
					max={100}
					step={1}
					unit="%"
					value={noiseAmount}
					onChange={onNoiseAmountChange}
				/>
			</section>

			{error ? <p className="mt-5 border-t border-rose-100 pt-4 text-xs leading-5 text-rose-700">{error}</p> : null}
		</aside>
	);
}
