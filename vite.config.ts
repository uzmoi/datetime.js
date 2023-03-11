import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import pkg from "./package.json";

export default defineConfig({
    esbuild: {
        minifyIdentifiers: false,
    },
    build: {
        lib: {
            entry: "src/index.ts",
            fileName: "datetime",
            name: "rdt",
        },
        rollupOptions: {
            external: Object.keys(pkg.dependencies),
            output: {
                globals: {
                    emnorst: "emnorst",
                },
            },
        },
    },
    plugins: [dts()],
});
