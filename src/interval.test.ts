import { describe, expect, test } from "vitest";
import { DateTime } from "./datetime";
import type { DurationObject } from "./duration";
import { Interval } from "./interval";
import {
    daysInMonth,
    daysInYearWithoutLeapDay,
    hoursInDay,
    millisInSecond,
    minutesInHour,
    monthsInYear,
    secondsInMinute,
} from "./number";

describe("Interval", () => {
    // prettier-ignore
    const plus: DurationObject = {
        years:        1,
        months:       2,
        days:         26,
        hours:        6,
        minutes:      33,
        seconds:      4,
        milliseconds: 999,
    };
    const start = DateTime.from("2022-11-07T01:23:45.678Z");
    test.each<DurationObject>([
        plus,
        // prettier-ignore
        { years: 2, months: 1, days: 30, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
        // prettier-ignore
        { years: 5, months: 2, days: 27, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
        // prettier-ignore
        { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
    ])("new %j", dur => {
        expect(new Interval(start, start.plus(dur))).toMatchObject(dur);
    });
    {
        // prettier-ignore
        const expectedDays = plus.years * daysInYearWithoutLeapDay
            + daysInMonth(start.year + plus.years, start.month + 1)
            + daysInMonth(start.year + plus.years + 1, (start.month + 2) % monthsInYear);
        test.each([
            ["years", plus.years],
            ["months", plus.years * monthsInYear + plus.months],
            // prettier-ignore
            ["milliseconds", ([
                [1,               plus.days],
                [hoursInDay,      plus.hours],
                [minutesInHour,   plus.minutes],
                [secondsInMinute, plus.seconds],
                [millisInSecond,  plus.milliseconds],
            ] as const).reduce((prev, [rate, value]) => prev * rate + value, expectedDays)],
            // ["weeks", Math.floor(expectedDays / daysInWeek)],
        ] as const)(".to('%s')", (key, expected) => {
            const interval = new Interval(start, start.plus(plus));
            expect(interval.to(key)).toBe(expected);
        });
    }
    test("(unixEpoch..now).to('milliseconds') === Date.now()", () => {
        const now = Date.now();
        const interval = Interval.from("1970-01-01T00:00:00.000Z", now);
        expect(interval.to("milliseconds")).toBe(now);
    });
    test("overlaps", () => {
        const a = Interval.from([2000], [2020]);
        const b = Interval.from([2010], [2030]);
        expect(a.overlaps(b)).toBe(true);
        expect(b.overlaps(a)).toBe(true);
    });
});
