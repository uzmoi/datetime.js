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
