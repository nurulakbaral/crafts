struct Params {
	time: f32,
	aspect: f32,
	wind: f32,
	padding: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

const TAU = 6.28318530718;
const LEAF_COUNT = 18;

fn hash(value: f32) -> f32 {
	return fract(sin(value * 127.1 + 311.7) * 43758.5453);
}

fn rotate(point: vec2f, angle: f32) -> vec2f {
	let cosine = cos(angle);
	let sine = sin(angle);
	return vec2f(
		point.x * cosine - point.y * sine,
		point.x * sine + point.y * cosine,
	);
}

fn leafMask(point: vec2f) -> f32 {
	// A pointed, tapered leaf silhouette in local coordinates.
	let silhouette = abs(point.x) + pow(abs(point.y), 1.16) - 1.0;
	return 1.0 - smoothstep(-0.018, 0.018, silhouette);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
	let horizon = smoothstep(0.0, 1.0, uv.y);
	var color = mix(vec3f(0.025, 0.095, 0.145), vec3f(0.19, 0.055, 0.055), horizon);

	let sunset = 1.0 - smoothstep(0.18, 0.78, distance(uv, vec2f(0.72, 0.36)));
	color = mix(color, vec3f(0.72, 0.20, 0.075), sunset * 0.28);
	color += vec3f(0.12, 0.045, 0.015) * smoothstep(0.72, 1.0, uv.y);

	for (var index = 0; index < LEAF_COUNT; index = index + 1) {
		let id = f32(index);
		let phase = hash(id + 1.0);
		let depth = hash(id + 12.0);
		let fall = fract(phase + params.time * mix(0.055, 0.145, depth));
		let sway = sin(params.time * mix(0.55, 1.2, depth) + phase * TAU);
		let center = vec2f(
			fract(hash(id + 4.0) + sway * mix(0.035, 0.13, depth) * params.wind),
			-0.16 + fall * 1.34,
		);

		let size = vec2f(
			mix(0.020, 0.040, depth),
			mix(0.042, 0.085, depth),
		);
		let worldPoint = (uv - center) * vec2f(params.aspect, 1.0);
		let angle = phase * TAU + params.time * mix(-1.45, 1.45, hash(id + 24.0)) + sway * 0.32;
		let localPoint = rotate(worldPoint, angle) / size;
		let mask = leafMask(localPoint);

		let boundaryFade = smoothstep(-0.02, 0.11, center.y) * (1.0 - smoothstep(1.02, 1.18, center.y));
		let alpha = mask * boundaryFade * mix(0.52, 0.92, depth);
		let palette = hash(id + 41.0);
		var leafColor = mix(vec3f(0.46, 0.045, 0.018), vec3f(0.98, 0.43, 0.055), palette);

		let midrib = 1.0 - smoothstep(0.035, 0.10, abs(localPoint.x));
		let sideVeins = 0.5 + 0.5 * sin((localPoint.x * 11.0 - localPoint.y * 5.0) * TAU);
		let veinShade = (midrib * 0.32 + sideVeins * 0.08) * mask;
		leafColor *= mix(0.72, 1.14, 1.0 - localPoint.y * 0.5);
		leafColor = mix(leafColor, leafColor * 0.48, veinShade);

		color = mix(color, leafColor, alpha);
	}

	let vignette = 1.0 - smoothstep(0.35, 0.93, distance(uv, vec2f(0.5, 0.5)));
	color *= mix(0.56, 1.0, vignette);
	return vec4f(color, 1.0);
}
