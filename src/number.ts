import type { DateObject } from "./datetime";

// Leap

export const isLeapYear = (year: number): boolean => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

export const leapDays = (year: number): number => {
    return ((year / 4) | 0) - ((year / 100) | 0) + ((year / 400) | 0);
};

// Month

export const monthsInYear = 12;

// Week

export type WeeksInYear = 52 | 53;

export const weeksInYear = (year: number): WeeksInYear => {
    const weekday = (year + leapDays(year - 1)) % daysInWeek;
    return weekday === 0 || (weekday === 6 && isLeapYear(year)) ? 53 : 52;
};

// Day

export type DaysInYear = 365 | 366;

export const daysInYearWithoutLeapDay = 365;

export const daysInYear = (year: number): DaysInYear => {
    return (daysInYearWithoutLeapDay + +isLeapYear(year)) as DaysInYear;
};

export const dayOfYear = (date: DateObject): number => {
    // this.month が
    //   1 ならば 13
    //   2 ならば 14
    //   それ以外ならば this.month
    // それに + 1 する
    const m = ((date.month + 9) % 12) + 4;
    // fairfieldの公式
    // -64 === -122 + 31(1月の日数) + 28(2月の日数) - 1(dayが1から始まるため、1月1日を0とする調整)
    const dayOfYearWithoutLeapDay =
        ((((306 * m) / 10) | 0) - 64 + date.day) % daysInYearWithoutLeapDay;

    const leapDay = +(date.month > 2 && isLeapYear(date.year));
    return dayOfYearWithoutLeapDay + leapDay;
};

export type DaysInMonth = 28 | 29 | 30 | 31;

const daysInMonthArray = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const satisfies readonly DaysInMonth[];

export const daysInMonth = (year: number, month: number): DaysInMonth => {
    const leapDay = +(month === 2 && isLeapYear(year));
    return (daysInMonthArray[month - 1] + leapDay) as DaysInMonth;
};

export const daysInWeek = 7;

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const weekday = (date: DateObject): Weekday => {
    const dayFromUnixEpoch =
        date.year + leapDays(date.year - 1) + dayOfYear(date);
    return (dayFromUnixEpoch % daysInWeek) as Weekday;
};

// Time

export const hoursInDay = 24;
export const minutesInHour = 60;
export const secondsInMinute = 60;
export const millisInSecond = 1000;
