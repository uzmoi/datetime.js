// @ts-check
// https://jestjs.io/docs/configuration

/** @type {import("@jest/types").Config.InitialOptions} */
export default {
    roots: ["<rootDir>/src/"],
    injectGlobals: false,
    collectCoverageFrom: ["src/**/*.ts"],
    coverageDirectory: "coverage",
    coverageProvider: "v8",
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "\\.ts$": ["@swc/jest", {
            module: { type: "commonjs" },
            sourceMaps: true,
        }],
    },
};
