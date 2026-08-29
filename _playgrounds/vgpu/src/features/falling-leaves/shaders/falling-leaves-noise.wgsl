struct Params {
	resolution: vec2f,
	time: f32,
	amount: f32,
}

@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var<uniform> params: Params;

fn hash(value: u32) -> u32 {
	var state = value * 747796405u + 2891336453u;
	let word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
	return (word >> 22u) ^ word;
}

fn random(seed: u32) -> f32 {
	return f32(hash(seed)) / 4294967295.0;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
	let amount = clamp(params.amount, 0.0, 1.0);
	let pixel = vec2u(floor(uv * params.resolution));
	let noisePixel = pixel / 4u;
	let animationFrame = u32(floor(params.time * 12.0));
	let pixelSeed = noisePixel.x * 1973u + noisePixel.y * 9277u + animationFrame * 26699u;
	let pixelValue = step(0.5, random(pixelSeed));
	let sourceColor = textureSampleLevel(source, sourceSampler, uv, 0.0);
	let color = mix(sourceColor.rgb, vec3f(pixelValue), amount);

	return vec4f(color, 1.0);
}
