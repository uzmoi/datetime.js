import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
    build: {
        lib: {
            entry: "src/main.ts",
            formats: ["es"],
            fileName: "datetime"
        },
        rollupOptions: {
            external: Object.keys(pkg.dependencies),
        },
    },
    plugins: [dts()],
});
