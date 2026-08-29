struct Params {
	texelSize: vec2f,
	amount: f32,
	time: f32,
}

@group(0) @binding(0) var source: texture_2d<f32>;
@group(0) @binding(1) var sourceSampler: sampler;
@group(0) @binding(2) var<uniform> params: Params;

fn liquidNormal(uv: vec2f, time: f32) -> vec2f {
	let flow = time * 0.32;
	let broad = vec2f(
		sin(uv.y * 6.5 + cos(uv.x * 4.0 + flow) * 1.15 + flow),
		cos(uv.x * 5.5 + sin(uv.y * 3.8 - flow) * 1.05 - flow * 0.8),
	);
	let detail = vec2f(
		sin((uv.x + uv.y) * 12.0 - flow * 1.4),
		cos((uv.x - uv.y) * 10.0 + flow * 1.2),
	);
	return broad * 0.74 + detail * 0.26;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
	let amount = clamp(params.amount, 0.0, 1.0);
	let normal = liquidNormal(uv, params.time);
	let refractedUv = uv + normal * params.texelSize * (28.0 * amount);
	let blurRadius = params.texelSize * (30.0 * amount * amount);
	var glassColor = textureSampleLevel(source, sourceSampler, refractedUv, 0.0).rgb * 0.20;

	glassColor += textureSampleLevel(source, sourceSampler, refractedUv + vec2f(blurRadius.x, 0.0), 0.0).rgb * 0.12;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv - vec2f(blurRadius.x, 0.0), 0.0).rgb * 0.12;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv + vec2f(0.0, blurRadius.y), 0.0).rgb * 0.12;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv - vec2f(0.0, blurRadius.y), 0.0).rgb * 0.12;

	let diagonal = blurRadius * 0.70710678;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv + diagonal, 0.0).rgb * 0.08;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv - diagonal, 0.0).rgb * 0.08;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv + vec2f(diagonal.x, -diagonal.y), 0.0).rgb * 0.08;
	glassColor += textureSampleLevel(source, sourceSampler, refractedUv + vec2f(-diagonal.x, diagonal.y), 0.0).rgb * 0.08;

	// Liquid refraction remains visible while the upper range closes into a
	// heavily frosted iOS-style pane that conceals the background.
	let surfaceNormal = normalize(vec3f(normal * 0.42, 1.0));
	let lightDirection = normalize(vec3f(-0.42, -0.58, 1.0));
	let viewDirection = vec3f(0.0, 0.0, 1.0);
	let halfDirection = normalize(lightDirection + viewDirection);
	let specular = pow(max(dot(surfaceNormal, halfDirection), 0.0), 28.0);
	let fresnel = pow(1.0 - max(dot(surfaceNormal, viewDirection), 0.0), 2.0);
	let materialLight = (specular * 0.24 + fresnel * 0.10) * amount;
	glassColor = clamp(glassColor + vec3f(materialLight), vec3f(0.0), vec3f(1.0));
	let frost = smoothstep(0.68, 1.0, amount) * 0.96;
	glassColor = mix(glassColor, vec3f(0.965, 0.98, 1.0), frost);

	return vec4f(glassColor, 1.0);
}
