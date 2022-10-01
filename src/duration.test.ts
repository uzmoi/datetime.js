import { describe, expect, test } from "vitest";
import {
    DateTime,
    daysInMonth,
    daysInYear,
    hoursInDay,
    millisInSecond,
    minutesInHour,
    monthsInYear,
    secondsInMinute,
} from "./datetime";
import { DateTimeRange, IDuration } from "./duration";

describe("DateTimeRange", () => {
    const plus: IDuration = {
        years:        1,
        months:       2,
        days:         26,
        hours:        6,
        minutes:      33,
        seconds:      4,
        milliseconds: 999,
    };
    const dt = DateTime.from("2022-11-07T01:23:45.678Z");
    test("new", () => {
        const range = new DateTimeRange(dt, dt.plus(plus));
        expect({ ...range }).toEqual({
            ...plus,
            start: dt,
            end: dt.plus(plus),
        });
    });
    {
        const expectedDays = plus.years * daysInYear
            + daysInMonth(dt.year + plus.years, dt.month + 1)
            + daysInMonth(dt.year + plus.years + 1, (dt.month + 2) % monthsInYear);
        test.each([
            ["years",  plus.years],
            ["months", plus.years * monthsInYear + plus.months],
            ["milliseconds", ([
                [1,               plus.days],
                [hoursInDay,      plus.hours],
                [minutesInHour,   plus.minutes],
                [secondsInMinute, plus.seconds],
                [millisInSecond,  plus.milliseconds],
            ] as const).reduce((prev, [rate, value]) => prev * rate + value, expectedDays)],
            // ["weeks", Math.floor(expectedDays / daysInWeek)],
        ] as const)(".to('%s')", (key, expected) => {
            const range = DateTime.range(dt, dt.plus(plus));
            expect(range.to(key)).toBe(expected);
        });
    }
    test("(unixEpoch..now).to('milliseconds') === Date.now()", () => {
        const rangeFromUnixEpochToNow = DateTime.range("1970-01-01T00:00:00.000Z", DateTime.now());
        expect(rangeFromUnixEpochToNow.to("milliseconds")).toBe(Date.now());
    });
});
