import { describe, expect, test } from "vitest";
import { offsetToString } from "./string";

describe.todo("dateToString");

describe.todo("timeToString");

describe("offsetToString", () => {
    test("Z", () => {
        expect(offsetToString(0)).toBe("Z");
    });
    test("+00:00", () => {
        expect(offsetToString(0, false)).toBe("+00:00");
    });
    test("-01:30", () => {
        expect(offsetToString(90)).toBe("-01:30");
    });
    test("+01:30", () => {
        expect(offsetToString(-90)).toBe("+01:30");
    });
});
