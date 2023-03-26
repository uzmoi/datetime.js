import type { DateObject, TimeObject } from "./datetime";
import { minutesInHour, weekday, type Weekday } from "./number";

export const formatInt = (n: number, len: number) =>
    String(n | 0).padStart(len, "0");

export const dateToString = (
    date: DateObject,
    format?: "extended" | "basic",
): string => {
    const delim = format === "basic" ? "" : "-";
    return (
        formatInt(date.year, 4) +
        delim +
        formatInt(date.month, 2) +
        delim +
        formatInt(date.day, 2)
    );
};

export const timeToString = (
    time: TimeObject,
    format?: "extended" | "basic",
): string => {
    const delim = format === "basic" ? "" : ":";
    return (
        formatInt(time.hour, 2) +
        delim +
        formatInt(time.minute, 2) +
        delim +
        formatInt(time.second, 2) +
        "." +
        formatInt(time.millisecond, 3)
    );
};

export const offsetToString = (
    offset: number,
    z = true,
    format?: "extended" | "basic",
): string => {
    if (z && offset === 0) {
        return "Z";
    }
    const sign = offset > 0 ? "-" : "+";
    const absOffset = Math.abs(offset);
    const delim = format === "basic" ? "" : ":";
    const hour = formatInt(absOffset / minutesInHour, 2);
    const minute = formatInt(absOffset % minutesInHour, 2);
    return sign + hour + delim + minute;
};

// Month

export type MonthStringLong = (typeof monthStringArray)[number];
export type MonthStringShort = Head3<MonthStringLong>;

const monthStringArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
] as const;

export const monthString: {
    (month: number, long: true): MonthStringLong;
    (month: number, long?: false): MonthStringShort;
} = (month: number, long = false): never => {
    const longString = monthStringArray[month - 1];
    return (long ? longString : longString.slice(0, 3)) as never;
};

// Weekday

export type WeekdayStringLong = `${(typeof weekDayStringArray)[number]}day`;
export type WeekdayStringShort = Head3<WeekdayStringLong>;

const weekDayStringArray = [
    "Sun",
    "Mon",
    "Tues",
    "Wednes", // cspell:disable-line
    "Thurs",
    "Fri",
    "Satur", // cspell:disable-line
] as const;

export const weekdayString: {
    (date: Weekday | DateObject, long: true): WeekdayStringLong;
    (date: Weekday | DateObject, long?: false): WeekdayStringShort;
} = (date: Weekday | DateObject, long = false): never => {
    const base =
        weekDayStringArray[typeof date === "number" ? date : weekday(date)];
    const result: WeekdayStringShort | WeekdayStringLong = long
        ? `${base}day`
        : (base.slice(0, 3) as WeekdayStringShort);
    return result as never;
};

// Utils

type Head3<T extends string> =
    T extends `${infer H1}${infer H2}${infer H3}${string}`
        ? `${H1}${H2}${H3}`
        : never;
