import { minutesInHour } from "../number";
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
