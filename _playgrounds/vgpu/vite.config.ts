import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { wgslVitePlugin } from "@vgpu/wgsl/loader-vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), wgslVitePlugin()],
	resolve: {
		alias: {
			"~": "/src",
		},
	},
});
