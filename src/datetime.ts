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
    static from(source: string | number | Date): DateTime {
        if(typeof source === "string" || typeof source === "number") {
            source = new Date(source);
        }
        if(source instanceof Date) {
            return new DateTime(
                source.getUTCFullYear(),
                source.getUTCMonth() + 1,
                source.getUTCDate(),
                source.getUTCHours(),
                source.getUTCMinutes(),
                source.getUTCSeconds(),
                source.getUTCMilliseconds(),
            );
        }
        // @ts-expect-error
        const _: never = source;
        throw new TypeError("unknown source type.");
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
}

export const yearday = (date: IDate): number => {
    // this.month が
    //   1 ならば 13
    //   2 ならば 14
    //   それ以外ならば this.month
    // それに + 1 する
    const m = (date.month + 9) % 12 + 4;
    // fairfieldの公式
    // -64 === -122 + 31(1月の日数) + 28(2月の日数) - 1(dayが1から始まるため、1月1日を0とする調整)
    const dayOfYearWithoutLeapDay = ((306 * m / 10 | 0) - 64 + date.day) % daysInYear;

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

export const daysInYear = 365;
export const daysInWeek = 7;
export const monthsInYear = 12;

export const hoursInDay = 24;
export const minutesInHour = 60;
export const secondsInMinute = 60;
export const millisInSecond = 1000;
