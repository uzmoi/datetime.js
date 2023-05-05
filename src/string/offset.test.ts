import { describe, expect, test } from "@jest/globals";
import { offsetToString } from "./offset";

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
    test("+0130", () => {
        expect(offsetToString(-90, true, "basic")).toBe("+0130");
    });
});
