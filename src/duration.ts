import { DateTime } from "./datetime";

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
}
