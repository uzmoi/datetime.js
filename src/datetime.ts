export interface IDate {
    year: number;
    month: number;
    day: number;
}

export interface ITime {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export interface IDateTime extends IDate, ITime {}

export class DateTime implements IDateTime {
    private constructor(
        readonly year: number,
        readonly month: number,
        readonly day: number,
        readonly hour: number,
        readonly minute: number,
        readonly second: number,
        readonly millisecond: number,
    ) {}
}

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

export const daysInYear = 365;
export const daysInWeek = 7;
export const monthsInYear = 12;

export const hoursInDay = 24;
export const minutesInHour = 60;
export const secondsInMinute = 60;
export const millisInSecond = 1000;
