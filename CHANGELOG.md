
# Change Log

## [Unreleased]

### Added

- parseOffset
- OffsetParseOptions type
- formatOffset
- OffsetFormatOptions type
- daysInYearAverage
- daysBetween

## Changed

- Change monthString and weekdayString option.

### Removed

- Removed offsetToString. Use formatOffset instead.

## [0.3.0] - 2023-04-15

### Added

- formatInt
- DateTime.fromTuple
- dateTimeUnits

## Changed

- Split umd module into cjs and iife. iife does not require emnorst.

## [0.2.1] - 2023-03-14

### Fixed

- Fix "types" path in package.json.
- DateTimeTuple type allowed empty.

## [0.2.0] - 2023-03-14

### Added

- DateTime.fromNativeDate
- DateTime.fromObject
- DateTime.fromMillis
- daysInMonthAverage
- dateToString
- timeToString
- offsetToString
- WeeksInMonth type
- weeksInMonth
- WeekOfMonth type
- weekOfMonth
- weekOfYear
- Weekday object

### Changed

- Rename yearday to dayOfYear.
- Set sideEffects to false.
- The type of "this" was made explicit.
- weekStart in weeksInYear.
- Set DateTime default year to 1970.
- Add day to the normalizeTime result.
- Allow Weekday type in argument of weekdayString.

### Removed

- Removed PartialDateTimeObject type. Use `Partial<DateTimeObject>` instead.

### Fixed

- weeksInYear

## [0.1.0] - 2022-10-10

- `DateObject` type
- `TimeObject` type
- `DateTimeObject` type
- `PartialDateTimeObject` type
- `DateTimeTuple` type
- `DateTimeLike` type
- `DateTime` class
- `DateTime.from` function
- `DateTime.now` function
- `DateTime.prototype.inLeapYear` getter
- `DateTime.prototype.monthStringShort` getter
- `DateTime.prototype.monthStringLong` getter
- `DateTime.prototype.weekdayStringShort` getter
- `DateTime.prototype.weekdayStringLong` getter
- `DateTime.prototype.weekday` getter
- `DateTime.prototype.yearday` getter
- `DateTime.prototype.toString` function
- `DateTime.prototype.valueOf` function
- `DateTime.prototype.with` function
- `DateTime.prototype.plus` function
- `DateTime.prototype.minus` function
- `DateTime.prototype.startOf` function
- `DateTime.prototype.endOf` function
- `WeekdayStringLong` type
- `WeekdayStringShort` type
- `weekdayString` function
- `Weekday` type
- `weekday` function
- `WeeksInYear` type
- `weeksInYear` function
- `DaysInYear` type
- `daysInYearWithoutLeapDay` constant
- `daysInYear` function
- `yearday` function
- `isLeapYear` function
- `leapDays` function
- `monthsInYear` constant
- `DaysInMonth` type
- `daysInMonth` function
- `daysInWeek` constant
- `MonthStringLong` type
- `MonthStringShort` type
- `monthString` function
- `hoursInDay` constant
- `minutesInHour` constant
- `secondsInMinute` constant
- `millisInSecond` constant
- `DurationObject` type
- `Interval` class
- `Interval.from` function
- `Interval.before` function
- `Interval.after` function
- `Interval.prototype.to` function
- `Interval.prototype.contains` function
- `Interval.prototype.overlaps` function
