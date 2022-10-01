import { assert } from "emnorst";
import { DateTime, daysInYear, leapDays, yearday } from "./datetime";

export interface IDuration {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

export class DateTimeRange implements IDuration {
    readonly years: number;
    readonly months: number;
    readonly days: number;
    readonly hours: number;
    readonly minutes: number;
    readonly seconds: number;
    readonly milliseconds: number;
    constructor(
        readonly start: DateTime,
        readonly end: DateTime,
    ) {
        this.years        = end.year        - start.year;
        this.months       = end.month       - start.month;
        this.days         = end.day         - start.day;
        this.hours        = end.hour        - start.hour;
        this.minutes      = end.minute      - start.minute;
        this.seconds      = end.second      - start.second;
        this.milliseconds = end.millisecond - start.millisecond;
    }
    to(key: keyof IDuration): number {
        if(key === "years") {
            return this.years;
        }
        if(key === "months") {
            return this.years * 12 + this.months;
        }
        const days = this.years * daysInYear
            + leapDays(this.end.year) - leapDays(this.start.year)
            + yearday(this.end) - yearday(this.start);
        if(key === "days") {
            return days;
        }
        const hours = days * 24 + this.hours;
        if(key === "hours") {
            return hours;
        }
        const minutes = hours * 60 + this.minutes;
        if(key === "minutes") {
            return minutes;
        }
        const seconds = minutes * 60 + this.seconds;
        if(key === "seconds") {
            return seconds;
        }
        if(key === "milliseconds") {
            return seconds * 1000 + this.milliseconds;
        }
        assert.unreachable();
    }
}
