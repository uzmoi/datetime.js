import { hoursInDay, minutesInHour } from "../number";
import { formatInt } from "./util";

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

export type ParseOffsetOptions = {
    allowLowerCase?: boolean;
    alwaysExtended?: boolean;
};

const OffsetRegex = /^[+-](\d\d)(?::?(\d\d))?$/;

export const parseOffset = (
    offset: string,
    options?: ParseOffsetOptions,
): number | null => {
    if (offset === "Z" || (options?.allowLowerCase && offset === "z")) {
        return 0;
    }

    const isBasicFormat = offset.length !== 6;

    if (options?.alwaysExtended && isBasicFormat) {
        return null;
    }

    const matchResult = OffsetRegex.exec(offset);
    if (matchResult == null) {
        return null;
    }

    const hour = Number(matchResult[1]);
    if (hour > hoursInDay) {
        return null;
    }

    const minute = Number(matchResult[2] || "");
    if (minute >= minutesInHour) {
        return null;
    }

    return (
        ((offset[0] === "+") === !/00:00/.test(offset) ? -1 : 1) *
        (hour * minutesInHour + minute)
    );
};
