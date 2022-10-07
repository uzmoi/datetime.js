import { DateObject, TimeObject, minutesInHour } from "./datetime";

const pad0 = (n: number, len: number) => String(n | 0).padStart(len, "0");

export const dateToString = (date: DateObject): string => {
    return pad0(date.year, 4) + "-" + pad0(date.month, 2) + "-" + pad0(date.day, 2);
};

export const timeToString = (time: TimeObject): string => {
    return pad0(time.hour, 2)
        + ":" + pad0(time.minute, 2)
        + ":" + pad0(time.second, 2)
        + "." + pad0(time.millisecond, 3);
};
