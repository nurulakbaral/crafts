struct Params {
	time: f32,
	aspect: f32,
	wind: f32,
	sizeScale: f32,
	leafCount: f32,
	padding0: f32,
	padding1: f32,
	padding2: f32,
}

@group(0) @binding(0) var<uniform> params: Params;

const TAU = 6.28318530718;
const MAX_LEAF_COUNT = 36;

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

fn leafCurve(y: f32) -> f32 {
	return 0.075 * max(1.0 - y * y, 0.0);
}

fn leafField(point: vec2f) -> f32 {
	// Two overlapping circles form curved sides with natural pointed ends.
	let curvedPoint = vec2f((point.x - leafCurve(point.y)) * 0.46, point.y * 0.835);
	let leftArc = length(curvedPoint - vec2f(0.55, 0.0)) - 1.0;
	let rightArc = length(curvedPoint + vec2f(0.55, 0.0)) - 1.0;
	let lens = max(leftArc, rightArc);

	// Small teeth break up the otherwise perfect lens without changing its outline.
	let serrationFade = smoothstep(0.18, 0.72, abs(point.x)) * (1.0 - smoothstep(0.78, 1.0, abs(point.y)));
	let serration = sin((point.y + 1.0) * TAU * 5.5) * 0.012 * serrationFade;
	return lens - serration;
}

fn leafMask(point: vec2f) -> f32 {
	let field = leafField(point);
	let antiAlias = max(fwidth(field), 0.004);
	return 1.0 - smoothstep(-antiAlias, antiAlias, field);
}

fn stemMask(point: vec2f) -> f32 {
	let lengthMask = smoothstep(0.70, 0.78, point.y) * (1.0 - smoothstep(1.22, 1.30, point.y));
	let widthMask = 1.0 - smoothstep(0.025, 0.060, abs(point.x));
	return lengthMask * widthMask;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
	var color = vec3f(1.0);

	for (var index = 0; index < MAX_LEAF_COUNT; index = index + 1) {
		if (f32(index) >= params.leafCount) {
			break;
		}
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
			mix(0.023, 0.046, depth),
			mix(0.048, 0.094, depth),
		) * clamp(params.sizeScale, 0.6, 1.6);
		let worldPoint = (uv - center) * vec2f(params.aspect, 1.0);
		let angle = phase * TAU + params.time * mix(-1.45, 1.45, hash(id + 24.0)) + sway * 0.32;
		let localPoint = rotate(worldPoint, angle) / size;
		let bodyMask = leafMask(localPoint);
		let petioleMask = stemMask(localPoint);
		let mask = max(bodyMask, petioleMask);

		let boundaryFade = smoothstep(-0.02, 0.11, center.y) * (1.0 - smoothstep(1.02, 1.18, center.y));
		let alpha = mask * boundaryFade * mix(0.52, 0.92, depth);
		let palette = hash(id + 41.0);
		var leafColor = mix(vec3f(0.012, 0.24, 0.065), vec3f(0.48, 0.91, 0.16), palette);
		leafColor = mix(leafColor, vec3f(0.065, 0.52, 0.16), depth * 0.24);

		let centerlineDistance = abs(localPoint.x - leafCurve(localPoint.y));
		let midrib = (1.0 - smoothstep(0.025, 0.070, centerlineDistance)) * bodyMask;
		let branchPhase = abs(fract((localPoint.y + abs(localPoint.x) * 0.48 + 0.96) / 0.30) - 0.5);
		let branchVeins = (1.0 - smoothstep(0.025, 0.075, branchPhase))
			* smoothstep(0.10, 0.20, abs(localPoint.x))
			* (1.0 - smoothstep(0.72, 0.92, abs(localPoint.y)))
			* bodyMask;
		let edgeShade = smoothstep(-0.12, -0.012, leafField(localPoint)) * bodyMask;
		let mottle = 0.5 + 0.5 * sin(localPoint.x * 15.0 + sin(localPoint.y * 12.0));

		leafColor *= mix(0.80, 1.13, 1.0 - localPoint.y * 0.5);
		leafColor *= mix(0.92, 1.05, mottle * bodyMask);
		leafColor = mix(leafColor, leafColor * 0.54, midrib * 0.36 + branchVeins * 0.24 + edgeShade * 0.14);
		leafColor = mix(leafColor, vec3f(0.025, 0.20, 0.045), petioleMask * 0.88);

		color = mix(color, leafColor, alpha);
	}

	return vec4f(color, 1.0);
}
