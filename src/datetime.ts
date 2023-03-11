import { modulo, Normalize } from "emnorst";
import { DurationObject } from "./duration";
import {
    dayOfYear,
    daysInMonth,
    hoursInDay,
    isLeapYear,
    millisInSecond,
    minutesInHour,
    monthsInYear,
    secondsInMinute,
    Weekday,
    weekday,
} from "./number";
import {
    dateToString,
    monthString,
    MonthStringLong,
    MonthStringShort,
    timeToString,
    weekdayString,
    WeekdayStringLong,
    WeekdayStringShort,
} from "./string";

export interface DateObject {
    year: number;
    month: number;
    day: number;
}

export const normalizeDate = (date: DateObject): DateObject => {
    let day = date.day;
    let month = modulo(date.month, monthsInYear) || monthsInYear;
    let year = date.year + Math.floor((date.month - 1) / monthsInYear);
    while (day > daysInMonth(year, month)) {
        day -= daysInMonth(year, month);
        month++;
        if (month > monthsInYear) {
            month = 1;
            year++;
        }
    }
    while (day <= 0) {
        month--;
        if (month < 1) {
            month = monthsInYear;
            year--;
        }
        day += daysInMonth(year, month);
    }
    return { day, month, year };
};

export interface TimeObject {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export const normalizeTime = (time: TimeObject): TimeObject => {
    const millisecond = time.millisecond;
    const second = time.second + Math.floor(millisecond / millisInSecond);
    const minute = time.minute + Math.floor(second / secondsInMinute);
    const hour = time.hour + Math.floor(minute / minutesInHour);
    return {
        hour,
        minute: modulo(minute, minutesInHour),
        second: modulo(second, secondsInMinute),
        millisecond: modulo(millisecond, millisInSecond),
    };
};

export interface DateTimeObject extends DateObject, TimeObject {}

export type PartialDateTimeObject = Normalize<
    Partial<DateTimeObject> & Pick<DateTimeObject, "year">
>;

const normalizedDateTimeFrom = (
    get: (key: keyof DateTimeObject) => number,
): DateTime => {
    // prettier-ignore
    const time = normalizeTime({
        hour:        get("hour"),
        minute:      get("minute"),
        second:      get("second"),
        millisecond: get("millisecond"),
    });
    // prettier-ignore
    const date = normalizeDate({
        day:   get("day") + Math.floor(time.hour / hoursInDay),
        month: get("month"),
        year:  get("year"),
    });
    // @ts-expect-error
    return new DateTime(
        date.year,
        date.month,
        date.day,
        modulo(time.hour, hoursInDay),
        time.minute,
        time.second,
        time.millisecond,
    );
};

// prettier-ignore
export type DateTimeTuple = [
    year:         number,
    month?:       number,
    day?:         number,
    hour?:        number,
    minute?:      number,
    second?:      number,
    millisecond?: number,
];

export type DateTimeLike =
    | PartialDateTimeObject
    | DateTimeTuple
    | string
    | number
    | Date;

// prettier-ignore
const dateTimeDefaults: DateTimeObject = {
    year:        NaN,
    month:       1,
    day:         1,
    hour:        0,
    minute:      0,
    second:      0,
    millisecond: 0,
};

export class DateTime implements DateTimeObject {
    static now(): DateTime {
        return DateTime.from(Date.now());
    }
    static from(source: DateTimeLike): DateTime {
        if (source instanceof DateTime) {
            return source;
        }
        if (typeof source === "string" || typeof source === "number") {
            source = new Date(source);
        }
        if (source instanceof Date) {
            return DateTime.fromNativeDate(source);
        }
        if (Array.isArray(source)) {
            source = {
                year: source[0],
                month: source[1],
                day: source[2],
                hour: source[3],
                minute: source[4],
                second: source[5],
                millisecond: source[6],
            };
        }
        return DateTime.fromObject(source);
    }
    static fromNativeDate(nativeDate: Date): DateTime {
        return new DateTime(
            nativeDate.getUTCFullYear(),
            nativeDate.getUTCMonth() + 1,
            nativeDate.getUTCDate(),
            nativeDate.getUTCHours(),
            nativeDate.getUTCMinutes(),
            nativeDate.getUTCSeconds(),
            nativeDate.getUTCMilliseconds(),
        );
    }
    static fromObject<T extends PartialDateTimeObject>(
        dtObject: [unknown] extends [T extends DateTime ? unknown : never]
            ? never
            : T,
    ) {
        return normalizedDateTimeFrom(
            key => dtObject[key] ?? dateTimeDefaults[key],
        );
    }
    private constructor(
        readonly year: number,
        readonly month: number,
        readonly day: number,
        readonly hour: number,
        readonly minute: number,
        readonly second: number,
        readonly millisecond: number,
    ) {}
    get inLeapYear(): boolean {
        return isLeapYear(this.year);
    }
    get monthStringShort(): MonthStringShort {
        return monthString(this.month);
    }
    get monthStringLong(): MonthStringLong {
        return monthString(this.month, true);
    }
    get weekdayStringShort(): WeekdayStringShort {
        return weekdayString(this);
    }
    get weekdayStringLong(): WeekdayStringLong {
        return weekdayString(this, true);
    }
    get weekday(): Weekday {
        return weekday(this);
    }
    // cspell:disable-next-line
    get yearday(): number {
        return dayOfYear(this);
    }
    /**
     * @returns "YYYY-MM-DDThh:mm:ss.nnn"
     */
    toString(): string {
        return dateToString(this) + "T" + timeToString(this);
    }
    valueOf(): number {
        return Date.UTC(
            this.year,
            this.month - 1,
            this.day,
            this.hour,
            this.minute,
            this.second,
            this.millisecond,
        );
    }
    with(dt: Partial<DateTimeObject>): DateTime {
        return normalizedDateTimeFrom(key => dt[key] ?? this[key]);
    }
    plus(dur: Partial<DurationObject>): DateTime {
        return normalizedDateTimeFrom(key => this[key] + (dur[`${key}s`] ?? 0));
    }
    minus(dur: Partial<DurationObject>): DateTime {
        return normalizedDateTimeFrom(key => this[key] - (dur[`${key}s`] ?? 0));
    }
    startOf(key: DurationUnit): DateTime {
        const dt: Partial<DateTimeObject> = { millisecond: 0 };
        if (key === "week") {
            dt.day = this.day - weekday(this);
            key = "day";
        }
        block: {
            if (key === "second") break block;
            dt.second = 0;
            if (key === "minute") break block;
            dt.minute = 0;
            if (key === "hour") break block;
            dt.hour = 0;
            if (key === "day") break block;
            dt.day = 1;
            if (key === "month") break block;
            dt.month = 1;
        }
        return this.with(dt);
    }
    endOf(key: DurationUnit): DateTime {
        const start = this.startOf(key);
        if (key === "week") {
            return start.plus({ days: 7, milliseconds: -1 });
        } else {
            return start.plus({ [key + "s"]: 1, milliseconds: -1 });
        }
    }
}

type DurationUnit = Exclude<keyof DateTimeObject, "millisecond"> | "week";
