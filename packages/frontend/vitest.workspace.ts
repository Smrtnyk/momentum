import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
    {
        test: {
            environment: "node",
            include: ["src/**/*.unit.{test,spec}.ts"],
            name: "unit",
        },
    },
    {
        test: {
            browser: {
                enabled: true,
                instances: [{ browser: "chromium" }],
            },
            include: ["src/**/*.browser.{test,spec}.ts"],
            name: "browser",
        },
    },
]);
