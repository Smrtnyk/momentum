import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
    plugins: [vue(), vuetify()],
    test: {
        clearMocks: true,
        mockReset: true,
        root: ".",
        globals: false,
        pool: "threads",
        workspace: "./vitest.workspace.ts",
    },
});
