import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["cjs", "esm"],
        treeshake: "recommended",
        dts: true,
        clean: true,
    },
    {
        entry: ["src/index.ts"],
        format: ["iife"],
        globalName: "rdt",
        treeshake: "recommended",
        minify: true,
    },
]);
