import { expect, test } from "vitest";
import { DateTime } from "./datetime";
import { dayOfYear, isLeapYear, weekday, weeksInYear } from "./number";

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

test.each(Array.from({ length: 12 }, (_, i) => DateTime.from([2022, i + 1])))(
    "dayOfYear('%s')",
    dt => {
        expect(dayOfYear(dt)).toBe(
            Math.floor((+dt - +dt.startOf("year")) / 86400000),
        );
        expect(dt.startOf("year").plus({ days: dayOfYear(dt) })).toEqual(dt);
    },
);

test.todo("weekday");
