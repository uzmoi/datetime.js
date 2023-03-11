import { describe, expect, test } from "vitest";
import { DateTime } from "./datetime";
import { isLeapYear } from "./number";

describe("DateTime", () => {
    test(".toString()", () => {
        const dt = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(dt.toString()).toBe("2022-11-07T01:23:45.678");
    });
    test("plus", () => {
        const dt = DateTime.from([2022]).plus({
            months: 10,
            days: 6,
            hours: 1,
            minutes: 23,
            seconds: 45,
            milliseconds: 678,
        });
        expect(dt).toEqual(DateTime.from("2022-11-07T01:23:45.678Z"));
    });
    test("plus order", () => {
        const base = DateTime.from([2022]);
        const dt = base.plus({ years: 2 }).plus({ days: 60 });
        expect(isLeapYear(dt.year)).toBe(true);
        expect(base.plus({ years: 2, days: 60 })).toEqual(dt);
    });
    test.each([
        ["year",   "2022-01-01T00:00:00.000Z"], // prettier-ignore
        ["month",  "2022-11-01T00:00:00.000Z"], // prettier-ignore
        ["day",    "2022-11-07T00:00:00.000Z"], // prettier-ignore
        ["hour",   "2022-11-07T01:00:00.000Z"], // prettier-ignore
        ["minute", "2022-11-07T01:23:00.000Z"], // prettier-ignore
        ["second", "2022-11-07T01:23:45.000Z"], // prettier-ignore
        ["week",   "2022-11-06T00:00:00.000Z"], // prettier-ignore
    ] as const)(".startOf('%s')", (key, expected) => {
        const base = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(base.startOf(key)).toStrictEqual(DateTime.from(expected));
    });
    test.each([
        ["year",   "2022-12-31T23:59:59.999Z"], // prettier-ignore
        ["month",  "2022-11-30T23:59:59.999Z"], // prettier-ignore
        ["day",    "2022-11-07T23:59:59.999Z"], // prettier-ignore
        ["hour",   "2022-11-07T01:59:59.999Z"], // prettier-ignore
        ["minute", "2022-11-07T01:23:59.999Z"], // prettier-ignore
        ["second", "2022-11-07T01:23:45.999Z"], // prettier-ignore
        ["week",   "2022-11-12T23:59:59.999Z"], // prettier-ignore
    ] as const)(".endOf('%s')", (key, expected) => {
        const base = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(base.endOf(key)).toStrictEqual(DateTime.from(expected));
    });
});
