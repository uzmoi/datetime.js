import { modulo, Normalize } from "emnorst";
import { DurationObject } from "./duration";
import { dateToString, timeToString } from "./string";

export interface DateObject {
    year: number;
    month: number;
    day: number;
}

export const normalizeDate = (date: DateObject): DateObject => {
    let day = date.day;
    let month = modulo(date.month, monthsInYear) || monthsInYear;
    let year = date.year + Math.floor((date.month - 1) / monthsInYear);
    while(day > daysInMonth(year, month)) {
        day -= daysInMonth(year, month);
        month++;
        if(month > monthsInYear) {
            month = 1;
            year++;
        }
    }
    while(day <= 0) {
        month--;
        if(month < 1) {
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

export type PartialDateTimeObject = Normalize<Partial<DateTimeObject> & Pick<DateTimeObject, "year">>;

const normalizedDateTimeFrom = (get: (key: keyof DateTimeObject) => number): DateTime => {
    const time = normalizeTime({
        hour:        get("hour"),
        minute:      get("minute"),
        second:      get("second"),
        millisecond: get("millisecond"),
    });
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

export type DateTimeTuple = [
    year:         number,
    month?:       number,
    day?:         number,
    hour?:        number,
    minute?:      number,
    second?:      number,
    millisecond?: number,
];

export type DateTimeLike = PartialDateTimeObject | DateTimeTuple | string | number | Date;

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
        if(source instanceof DateTime) {
            return source;
        }
        if(typeof source === "string" || typeof source === "number") {
            source = new Date(source);
        }
        if(source instanceof Date) {
            return DateTime.fromNativeDate(source);
        }
        if(Array.isArray(source)) {
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
        dtObject: [unknown] extends [T extends DateTime ? unknown : never] ? never : T,
    ) {
        return normalizedDateTimeFrom(key => dtObject[key] ?? dateTimeDefaults[key]);
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
    get yearday(): number {
        return yearday(this);
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
    startOf(key: Exclude<keyof DateTimeObject, "millisecond"> | "week"): DateTime {
        const dt: Partial<DateTimeObject> = { millisecond: 0 };
        if(key === "week") {
            dt.day = this.day - weekday(this);
            key = "day";
        }
        block: {
            if(key === "second") break block;
            dt.second = 0;
            if(key === "minute") break block;
            dt.minute = 0;
            if(key === "hour") break block;
            dt.hour = 0;
            if(key === "day") break block;
            dt.day = 1;
            if(key === "month") break block;
            dt.month = 1;
        }
        return this.with(dt);
    }
    endOf(key: Exclude<keyof DateTimeObject, "millisecond"> | "week") {
        const start = this.startOf(key);
        if(key === "week") {
            return start.plus({ days: 7, milliseconds: -1 });
        } else {
            return start.plus({ [key + "s"]: 1, milliseconds: -1 });
        }
    }
}

export type WeekdayStringLong = `${typeof weekDayStringArray[number]}day`;
export type WeekdayStringShort = Head3<WeekdayStringLong>;

const weekDayStringArray = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur"] as const;

export const weekdayString: {
    (date: DateObject, long: true): WeekdayStringLong;
    (date: DateObject, long?: false): WeekdayStringShort;
} = (date: DateObject, long = false): never => {
    const base = weekDayStringArray[weekday(date)];
    const result: WeekdayStringShort | WeekdayStringLong = (
        long ? `${base}day` : base.slice(0, 3) as WeekdayStringShort
    );
    return result as never;
};

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const weekday = (date: DateObject): Weekday => {
    const dayFromUnixEpoc = date.year + leapDays(date.year - 1) + yearday(date);
    return dayFromUnixEpoc % daysInWeek as Weekday;
};

export type WeeksInYear = 52 | 53;

export const weeksInYear = (year: number): WeeksInYear => {
    const weekday = (year + leapDays(year - 1)) % daysInWeek;
    return weekday === 0 || (weekday === 6 && isLeapYear(year)) ? 53 : 52;
};

export type DaysInYear = 365 | 366;

export const daysInYearWithoutLeapDay = 365;

export const daysInYear = (year: number): DaysInYear => {
    return daysInYearWithoutLeapDay + +isLeapYear(year) as DaysInYear;
};

export const yearday = (date: DateObject): number => {
    // this.month が
    //   1 ならば 13
    //   2 ならば 14
    //   それ以外ならば this.month
    // それに + 1 する
    const m = (date.month + 9) % 12 + 4;
    // fairfieldの公式
    // -64 === -122 + 31(1月の日数) + 28(2月の日数) - 1(dayが1から始まるため、1月1日を0とする調整)
    const dayOfYearWithoutLeapDay = ((306 * m / 10 | 0) - 64 + date.day) % daysInYearWithoutLeapDay;

    const leapDay = +(date.month > 2 && isLeapYear(date.year));
    return dayOfYearWithoutLeapDay + leapDay;
};

export const isLeapYear = (year: number): boolean => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const leapDays = (year: number): number => {
    return (year / 4 | 0) - (year / 100 | 0) + (year / 400 | 0);
};

export type DaysInMonth = 28 | 29 | 30 | 31;

const daysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

export const daysInMonth = (year: number, month: number): DaysInMonth => {
    const leapDay = +(month === 2 && isLeapYear(year));
    return daysInMonthArray[month - 1] + leapDay as DaysInMonth;
};

export const daysInWeek = 7;
export const monthsInYear = 12;

export type MonthStringLong = typeof monthStringArray[number];
export type MonthStringShort = Head3<MonthStringLong>;

const monthStringArray = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
] as const;

export const monthString: {
    (month: number, long: true): MonthStringLong;
    (month: number, long?: false): MonthStringShort;
} = (month: number, long = false): never => {
    const longString = monthStringArray[month - 1];
    return (long ? longString : longString.slice(0, 3)) as never;
};

export const hoursInDay = 24;
export const minutesInHour = 60;
export const secondsInMinute = 60;
export const millisInSecond = 1000;

// utils

type Head3<T extends string> = (
    T extends `${infer H1}${infer H2}${infer H3}${string}`
        ? `${H1}${H2}${H3}`
    : never
);
