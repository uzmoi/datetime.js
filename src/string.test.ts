import { describe, expect, test } from "vitest";
import type { DateObject, TimeObject } from "./datetime";
import { dateToString, offsetToString, timeToString } from "./string";

describe("dateToString", () => {
    test.todo("basic");
    test("extended", () => {
        const date: DateObject = {
            year: 95,
            month: 8,
            day: 4,
        };
        expect(dateToString(date)).toBe("0095-08-04");
    });
});

describe("timeToString", () => {
    test.todo("basic");
    test("extended", () => {
        const time: TimeObject = {
            hour: 16,
            minute: 8,
            second: 4,
            millisecond: 2,
        };
        expect(timeToString(time)).toBe("16:08:04.002");
    });
});

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
