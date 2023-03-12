import { describe, expect, test } from "vitest";
import { DateTime } from "./datetime";
import {
    dayOfYear,
    isLeapYear,
    weekday,
    weekOfMonth,
    weeksInMonth,
    weeksInYear,
} from "./number";

test.each([
    { year: 2017, leap: false, weekDay: 0 },
    { year: 2018, leap: false, weekDay: 1 },
    { year: 2022, leap: false, weekDay: 6 },
    { year: 2012, leap: true, weekDay: 0 },
    { year: 2024, leap: true, weekDay: 1 },
    { year: 2028, leap: true, weekDay: 6 },
])(
    "weeksInYear($year) // leap=$leap, weekday=$weekday",
    ({ year, leap, weekDay }) => {
        expect(isLeapYear(year)).toBe(leap);
        expect(weekday({ year, month: 1, day: 1 })).toBe(weekDay);
        let expectWeeksInYear = 0;
        for (
            let x = DateTime.from([year]);
            x.year === year;
            x = x.plus({ days: 1 })
        ) {
            if (weekday(x) === 0) {
                expectWeeksInYear++;
            }
        }
        expect(weeksInYear(year)).toBe(expectWeeksInYear);
    },
);

test.each([
    [2015, 2, 4],
    [2016, 2, 5],
    [2026, 2, 4],
    [2023, 3, 5],
    [2023, 4, 6],
])("weeksInMonth(%i, %i) === %i", (year, month, expected) => {
    expect(weeksInMonth(year, month)).toBe(expected);
});

describe("weekOfMonth", () => {
    describe("1日に週が始まる場合", () => {
        test("7日は1", () => {
            expect(weekOfMonth({ year: 2023, month: 1, day: 7 })).toBe(1);
        });
        test("8日は2", () => {
            expect(weekOfMonth({ year: 2023, month: 1, day: 8 })).toBe(2);
        });
    });
    describe("2日に週が始まる場合", () => {
        test("1日は1", () => {
            expect(weekOfMonth({ year: 2023, month: 4, day: 1 })).toBe(1);
        });
        test("2日は2", () => {
            expect(weekOfMonth({ year: 2023, month: 4, day: 2 })).toBe(2);
        });
    });
});

test.each(Array.from({ length: 12 }, (_, i) => DateTime.from([2022, i + 1])))(
    "dayOfYear('%s')",
    dt => {
        expect(dayOfYear(dt)).toBe((+dt - +dt.startOf("year")) / 86400000);
        expect(dt.startOf("year").plus({ days: dayOfYear(dt) })).toEqual(dt);
    },
);

test.todo("weekday");
