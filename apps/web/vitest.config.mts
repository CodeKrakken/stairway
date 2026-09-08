import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL(".", import.meta.url)),
			"@stairway/types": fileURLToPath(
				new URL("../../packages/types/src/index.ts", import.meta.url),
			),
			"@stairway/validation": fileURLToPath(
				new URL("../../packages/validation/src/index.ts", import.meta.url),
			),
		},
	},
});