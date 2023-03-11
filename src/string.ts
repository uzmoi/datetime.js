import type { DateObject, TimeObject } from "./datetime";
import { weekday } from "./number";

const formatInt = (n: number, len: number) => String(n | 0).padStart(len, "0");

export const dateToString = (date: DateObject): string => {
    return (
        formatInt(date.year, 4) +
        "-" +
        formatInt(date.month, 2) +
        "-" +
        formatInt(date.day, 2)
    );
};

export const timeToString = (time: TimeObject): string => {
    return (
        formatInt(time.hour, 2) +
        ":" +
        formatInt(time.minute, 2) +
        ":" +
        formatInt(time.second, 2) +
        "." +
        formatInt(time.millisecond, 3)
    );
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
    (date: DateObject, long: true): WeekdayStringLong;
    (date: DateObject, long?: false): WeekdayStringShort;
} = (date: DateObject, long = false): never => {
    const base = weekDayStringArray[weekday(date)];
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
