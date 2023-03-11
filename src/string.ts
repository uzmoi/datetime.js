import { DateObject, TimeObject } from "./datetime";

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
