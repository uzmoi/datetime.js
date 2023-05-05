import { describe, expect, test } from "@jest/globals";
import { offsetToString, parseOffset } from "./offset";

describe("offsetToString", () => {
    test("Z", () => {
        expect(offsetToString(0)).toBe("Z");
    });
    test("+00:00", () => {
        expect(offsetToString(0, false)).toBe("+00:00");
    });
    test("-00:00", () => {
        expect(offsetToString(-0)).toBe("-00:00");
    });
    test("+01:30", () => {
        expect(offsetToString(90)).toBe("+01:30");
    });
    test("-01:30", () => {
        expect(offsetToString(-90)).toBe("-01:30");
    });
    test("basic format", () => {
        expect(offsetToString(90, true, "basic")).toBe("+0130");
    });
});

describe("parseOffset", () => {
    test("Z (upper case)", () => {
        expect(parseOffset("Z")).toBe(0);
    });
    describe("z (lower case)", () => {
        test("default", () => {
            expect(parseOffset("z")).toBeNull();
        });
        test("allowLowerZ: true", () => {
            expect(parseOffset("z", { allowLowerCase: true })).toBe(0);
        });
    });
    test("+00:00", () => {
        expect(parseOffset("+00:00")).toBe(0);
    });
    test("-00:00", () => {
        expect(parseOffset("-00:00")).toBe(-0);
    });
    test("+01:30", () => {
        expect(parseOffset("+01:30")).toBe(90);
    });
    test("-01:30", () => {
        expect(parseOffset("-01:30")).toBe(-90);
    });
    test("basic format", () => {
        expect(parseOffset("+0130")).toBe(90);
    });
    test("basic format (alwaysExtended: true)", () => {
        expect(parseOffset("+0130", { alwaysExtended: true })).toBeNull();
    });
    test("omit minutes", () => {
        expect(parseOffset("+01")).toBe(60);
    });
    test("invalid minutes", () => {
        expect(parseOffset("+00:60")).toBeNull();
    });
    test("invalid hours", () => {
        expect(parseOffset("+25:00")).toBeNull();
    });
});
