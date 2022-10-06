import { defineConfig } from "vitest/config";
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
});
