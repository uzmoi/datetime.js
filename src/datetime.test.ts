import { describe, expect, test } from "vitest";
import { DateTime, isLeapYear, yearday } from "./datetime";

describe("DateTime", () => {
    test(".toString()", () => {
        const dt = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(dt.toString()).toBe("2022-11-07T01:23:45.678");
    });
    test("plus", () => {
        const dt = DateTime.from("2022-01-01T00:00:00.000Z").plus({
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
        const base = DateTime.from("2022-01-01T00:00:00.000Z");
        const dt = base.plus({ years: 2 }).plus({ days: 60 });
        expect(isLeapYear(dt.year)).toBe(true);
        expect(base.plus({ years: 2, days: 60 })).toEqual(dt);
    });
    test.each([
        ["year",   "2022-01-01T00:00:00.000Z"],
        ["month",  "2022-11-01T00:00:00.000Z"],
        ["day",    "2022-11-07T00:00:00.000Z"],
        ["hour",   "2022-11-07T01:00:00.000Z"],
        ["minute", "2022-11-07T01:23:00.000Z"],
        ["second", "2022-11-07T01:23:45.000Z"],
        ["week",   "2022-11-06T00:00:00.000Z"],
    ] as const)(".startOf('%s')", (key, expected) => {
        const base = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(base.startOf(key)).toStrictEqual(DateTime.from(expected));
    });
    test.each([
        ["year",   "2022-12-31T23:59:59.999Z"],
        ["month",  "2022-11-30T23:59:59.999Z"],
        ["day",    "2022-11-07T23:59:59.999Z"],
        ["hour",   "2022-11-07T01:59:59.999Z"],
        ["minute", "2022-11-07T01:23:59.999Z"],
        ["second", "2022-11-07T01:23:45.999Z"],
        ["week",   "2022-11-12T23:59:59.999Z"],
    ] as const)(".endOf('%s')", (key, expected) => {
        const base = DateTime.from("2022-11-07T01:23:45.678Z");
        expect(base.endOf(key)).toStrictEqual(DateTime.from(expected));
    });
});

test.each(
    Array.from({ length: 12 }, (_, i) => {
        const m = String(i + 1).padStart(2, "0");
        return `2022-${m}-01T00:00:00.000Z`;
    })
)("yearday('%s')", isoString => {
    const dt = DateTime.from(isoString);
    // expect(yearday(dt)).toBe(Math.floor((+dt - +dt.startOf("year")) / 86400000));
    expect(dt.startOf("year").plus({ days: yearday(dt) })).toEqual(dt);
});
