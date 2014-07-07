// Type definitions for timezonecomplete
// Project: https://github.com/SpiritIT/timezonecomplete
// Definitions by: Rogier Schouten <https://github.com/rogierschouten>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// Generated by dts-bundle 0.1.1

declare module 'timezonecomplete' {
    /**
    * @return True iff the given year is a leap year.
    */
    export function isLeapYear(year: number): boolean;
    /**
    * @param year	The full year
    * @param month	The month 1-12
    * @return The number of days in the given month
    */
    export function daysInMonth(year: number, month: number): number;
    /**
    * Returns an ISO time string. Note that months are 1-12.
    */
    export function isoString(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): string;
    /**
    * Time units
    */
    export enum TimeUnit {
        Second = 0,
        Minute = 1,
        Hour = 2,
        Day = 3,
        Week = 4,
        Month = 5,
        Year = 6,
    }
    /**
    * Time duration. Create one e.g. like this: var d = Duration.hours(1).
    * Note that time durations do not take leap seconds etc. into account:
    * one hour is simply represented as 3600000 milliseconds.
    */
    export class Duration {
        /**
        * Positive number of milliseconds
        * Stored positive because otherwise we constantly have to choose
        * between Math.floor() and Math.ceil()
        */
        /**
        * Sign: 1 or -1
        */
        /**
        * Construct a time duration
        * @param n	Number of hours
        * @return A duration of n hours
        */
        static hours(n: number): Duration;
        /**
        * Construct a time duration
        * @param n	Number of minutes
        * @return A duration of n minutes
        */
        static minutes(n: number): Duration;
        /**
        * Construct a time duration
        * @param n	Number of seconds
        * @return A duration of n seconds
        */
        static seconds(n: number): Duration;
        /**
        * Construct a time duration
        * @param n	Number of milliseconds
        * @return A duration of n milliseconds
        */
        static milliseconds(n: number): Duration;
        /**
        * Construct a time duration of 0
        */
        constructor();
        /**
        * Construct a time duration from a number of milliseconds
        */
        constructor(milliseconds: number);
        /**
        * Construct a time duration from a string in format
        * [-]h[:m[:s[.n]]] e.g. -01:00:30.501
        */
        constructor(input: string);
        /**
        * @return another instance of Duration with the same value.
        */
        clone(): Duration;
        /**
        * The entire duration in milliseconds (negative or positive)
        */
        milliseconds(): number;
        /**
        * The millisecond part of the duration (always positive)
        * @return e.g. 400 for a -01:02:03.400 duration
        */
        millisecond(): number;
        /**
        * The entire duration in seconds (negative or positive, fractional)
        * @return e.g. 1.5 for a 1500 milliseconds duration
        */
        seconds(): number;
        /**
        * The second part of the duration (always positive)
        * @return e.g. 3 for a -01:02:03.400 duration
        */
        second(): number;
        /**
        * The entire duration in minutes (negative or positive, fractional)
        * @return e.g. 1.5 for a 90000 milliseconds duration
        */
        minutes(): number;
        /**
        * The minute part of the duration (always positive)
        * @return e.g. 2 for a -01:02:03.400 duration
        */
        minute(): number;
        /**
        * The entire duration in hours (negative or positive, fractional)
        * @return e.g. 1.5 for a 5400000 milliseconds duration
        */
        hours(): number;
        /**
        * The hour part of the duration (always positive).
        * Note that this part can exceed 23 hours, because for
        * now, we do not have a days() function
        * @return e.g. 25 for a -25:02:03.400 duration
        */
        wholeHours(): number;
        /**
        * Sign
        * @return "-" if the duration is negative
        */
        sign(): string;
        /**
        * @return True iff (this < other)
        */
        lessThan(other: Duration): boolean;
        /**
        * @return True iff this and other represent the same time duration
        */
        equals(other: Duration): boolean;
        /**
        * @return True iff this > other
        */
        greaterThan(other: Duration): boolean;
        /**
        * @return The minimum (most negative) of this and other
        */
        min(other: Duration): Duration;
        /**
        * @return The maximum (most positive) of this and other
        */
        max(other: Duration): Duration;
        /**
        * @return a new Duration of (this * value)
        */
        multiply(value: number): Duration;
        /**
         * Add a duration.
         * @return a new Duration of (this + value)
         */
        add(value: Duration): Duration;
        /**
         * Subtract a duration.
         * @return a new Duration of (this - value)
         */
        sub(value: Duration): Duration;
        /**
        * String in [-]hh:mm:ss.nnn notation. All fields are
        * always present except the sign.
        */
        toFullString(): string;
        /**
        * String in [-]hh[:mm[:ss[.nnn]]] notation. Fields are
        * added as necessary
        */
        toString(): string;
    }
    /**
    * The type of time zone
    */
    export enum TimeZoneKind {
        /**
        * Local time offset as determined by JavaScript Date class.
        */
        Local = 0,
        /**
        * Fixed offset from UTC, without DST.
        */
        Offset = 1,
        /**
        * IANA timezone managed through Olsen TZ database. Includes
        * DST if applicable.
        */
        Proper = 2,
    }
    /**
    * Time zone. The object is immutable because it is cached:
    * requesting a time zone twice yields the very same object.
    * Note that we use time zone offsets inverted w.r.t. JavaScript Date.getTimezoneOffset(),
    * i.e. offset 90 means +01:30.
    *
    * Time zones come in three flavors: the local time zone, as calculated by JavaScript Date,
    * a fixed offset ("+01:30") without DST, or a IANA timezone ("Europe/Amsterdam") with DST
    * applied depending on the time zone rules.
    */
    export class TimeZone {
        /**
        * The local time zone for a given date. Note that
        * the time zone varies with the date: amsterdam time for
        * 2014-01-01 is +01:00 and amsterdam time for 2014-07-01 is +02:00
        */
        static local(): TimeZone;
        /**
        * The UTC time zone.
        */
        static utc(): TimeZone;
        /**
        * Returns a time zone object from the cache. If it does not exist, it is created.
        * @return The time zone with the given offset w.r.t. UTC in minutes, e.g. 90 for +01:30
        */
        static zone(offset: number): TimeZone;
        /**
        * Returns a time zone object from the cache. If it does not exist, it is created.
        * @param s: Empty string for local time, a TZ database time zone name (e.g. Europe/Amsterdam)
        *			 or an offset string (either +01:30, +0130, +01, Z). For a full list of names, see:
        *			 https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
        */
        static zone(s: string): TimeZone;
        /**
        * The time zone identifier. Can be an offset "-01:30" or an
        * IANA time zone name "Europe/Amsterdam", or "localtime" for
        * the local time zone.
        */
        name(): string;
        /**
        * The kind of time zone (Local/Offset/Proper)
        */
        kind(): TimeZoneKind;
        /**
        * Equality operator. Maps zero offsets and different names for UTC onto
        * each other. Other time zones are not mapped onto each other.
        */
        equals(other: TimeZone): boolean;
        /**
        * Is this zone equivalent to UTC?
        */
        isUtc(): boolean;
        /**
        * Calculate timezone offset from a UTC time.
        * @param year local full year
        * @param month local month 1-12 (note this deviates from JavaScript date)
        * @param day local day of month 1-31
        * @param hour local hour 0-23
        * @param minute local minute 0-59
        * @param second local second 0-59
        * @param millisecond local millisecond 0-999
        * @return the offset of this time zone with respect to UTC at the given time.
        */
        offsetForUtc(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): number;
        /**
        * Calculate timezone offset from a zone-local time (NOT a UTC time).
        * @param year local full year
        * @param month local month 1-12 (note this deviates from JavaScript date)
        * @param day local day of month 1-31
        * @param hour local hour 0-23
        * @param minute local minute 0-59
        * @param second local second 0-59
        * @param millisecond local millisecond 0-999
        * @return the offset of this time zone with respect to UTC at the given time.
        */
        offsetForZone(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): number;
        /**
        * Convenience function, takes values from a Javascript Date
        * Calls offsetForUtc() with the contents of the date
        * @param date: the date
        * @param funcs: the set of functions to use: get() or getUTC()
        */
        offsetForUtcDate(date: Date, funcs: DateFunctions): number;
        /**
        * Convenience function, takes values from a Javascript Date
        * Calls offsetForUtc() with the contents of the date
        * @param date: the date
        * @param funcs: the set of functions to use: get() or getUTC()
        */
        offsetForZoneDate(date: Date, funcs: DateFunctions): number;
        /**
        * The time zone identifier (normalized).
        * Either "localtime", IANA name, or "+hh:mm" offset.
        */
        toString(): string;
        /**
        * Convert an offset number into an offset string
        * @param offset The offset in minutes from UTC e.g. 90 minutes
        * @return the offset in ISO notation "+01:30" for +90 minutes
        */
        static offsetToString(offset: number): string;
        /**
        * String to offset conversion.
        * @param s	Formats: "-01:00", "-0100", "-01", "Z"
        * @return offset w.r.t. UTC in minutes
        */
        static stringToOffset(s: string): number;
    }
    /**
    * For testing purposes, we often need to manipulate what the current
    * time is. This is an interface for a custom time source object
    * so in tests you can use a custom time source.
    */
    export interface TimeSource {
        /**
        * Return the current date+time as a javascript Date object
        */
        now(): Date;
    }
    /**
    * Default time source, returns actual time
    */
    export class RealTimeSource implements TimeSource {
        now(): Date;
    }
    /**
    * Indicates how a Date object should be interpreted.
    * Either we can take getYear(), getMonth() etc for our field
    * values, or we can take getUTCYear() etc to do that.
    */
    export enum DateFunctions {
        /**
        * Use the Date.getFullYear(), Date.getMonth(), ... functions.
        */
        Get = 0,
        /**
        * Use the Date.getUTCFullYear(), Date.getUTCMonth(), ... functions.
        */
        GetUTC = 1,
    }
    /**
    * Our very own DateTime class which is time zone-aware
    * and which can be mocked for testing purposes
    */
    export class DateTime {
        /**
        * Actual time source in use. Setting this property allows to
        * fake time in tests. DateTime.nowLocal() and DateTime.nowUtc()
        * use this property for obtaining the current time.
        */
        static timeSource: TimeSource;
        /**
        * Current date+time in local time (derived from DateTime.timeSource.now()).
        */
        static nowLocal(): DateTime;
        /**
        * Current date+time in UTC time (derived from DateTime.timeSource.now()).
        */
        static nowUtc(): DateTime;
        /**
        * Current date+time in the given time zone (derived from DateTime.timeSource.now()).
        * @param timeZone	The desired time zone.
        */
        static now(timeZone: TimeZone): DateTime;
        /**
        * Constructor. Creates current time in local timezone.
        */
        constructor();
        /**
        * Constructor
        * @param isoString	String in ISO 8601 format. Instead of ISO time zone,
        *		 it may include a space and then and IANA time zone.
        * e.g. "2007-04-05T12:30:40.500"					(no time zone, naive date)
        * e.g. "2007-04-05T12:30:40.500+01:00"				(UTC offset without daylight saving time)
        * or   "2007-04-05T12:30:40.500Z"					(UTC)
        * or   "2007-04-05T12:30:40.500 Europe/Amsterdam"	(IANA time zone, with daylight saving time if applicable)
        * @param timeZone	if given, the date in the string is assumed to be in this time zone.
        *					Note that it is NOT CONVERTED to the time zone. Useful
        *					for strings without a time zone
        */
        constructor(isoString: string, timeZone?: TimeZone);
        /**
        * Constructor. You provide a date, then you say whether to take the
        * date.getYear()/getXxx methods or the date.getUTCYear()/date.getUTCXxx methods,
        * and then you state which time zone that date is in.
        *
        * @param date	A date object.
        * @param getters	Specifies which set of Date getters contains the date in the given time zone: the
        *					Date.getXxx() methods or the Date.getUTCXxx() methods.
        * @param timeZone	The time zone that the given date is assumed to be in (may be null for unaware dates)
        */
        constructor(date: Date, getFuncs: DateFunctions, timeZone?: TimeZone);
        /**
        * Constructor. Note that unlike JavaScript dates we require fields to be in normal ranges.
        * Use the add(duration) or sub(duration) for arithmetic.
        * @param year	The full year (e.g. 2014)
        * @param month	The month [1-12] (note this deviates from JavaScript Date)
        * @param day	The day of the month [1-31]
        * @param hour	The hour of the day [0-24)
        * @param minute	The minute of the hour [0-59]
        * @param second	The second of the minute [0-59]
        * @param millisecond	The millisecond of the second [0-999]
        * @param timeZone	The time zone, or null (for unaware dates)
        */
        constructor(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number, timeZone?: TimeZone);
        /**
        * Constructor
        * @param unixTimestamp	milliseconds since 1970-01-01T00:00:00.000
        * @param timeZone	the time zone that the timestamp is assumed to be in (usually UTC).
        */
        constructor(unixTimestamp: number, timeZone?: TimeZone);
        /**
        * @return a copy of this object
        */
        clone(): DateTime;
        /**
        * @return The time zone that the date is in. May be null for unaware dates.
        */
        zone(): TimeZone;
        /**
        * @return the offset w.r.t. UTC in minutes. Returns 0 for unaware dates and for UTC dates.
        */
        offset(): number;
        /**
        * @return The full year e.g. 2014
        */
        year(): number;
        /**
        * @return The month 1-12 (note this deviates from JavaScript Date)
        */
        month(): number;
        /**
        * @return The day of the month 1-31
        */
        day(): number;
        /**
        * @return The hour 0-23
        */
        hour(): number;
        /**
        * @return the minutes 0-59
        */
        minute(): number;
        /**
        * @return the seconds 0-59
        */
        second(): number;
        /**
        * @return the milliseconds 0-999
        */
        millisecond(): number;
        /**
        * @return Milliseconds since 1970-01-01T00:00:00.000Z
        */
        unixUtcMillis(): number;
        /**
        * @return The full year e.g. 2014
        */
        utcYear(): number;
        /**
        * @return The UTC month 1-12 (note this deviates from JavaScript Date)
        */
        utcMonth(): number;
        /**
        * @return The UTC day of the month 1-31
        */
        utcDay(): number;
        /**
        * @return The UTC hour 0-23
        */
        utcHour(): number;
        /**
        * @return The UTC minutes 0-59
        */
        utcMinute(): number;
        /**
        * @return The UTC seconds 0-59
        */
        utcSecond(): number;
        /**
        * @return The UTC milliseconds 0-999
        */
        utcMillisecond(): number;
        /**
        * Convert this date to the given time zone (in-place).
        * Throws if this date does not have a time zone.
        * @return this (for chaining)
        */
        convert(zone?: TimeZone): DateTime;
        /**
        * Returns this date converted to the given time zone.
        * Unaware dates can only be converted to unaware dates (clone)
        * For unaware dates, an exception is thrown
        * @param zone	The new time zone. This may be null to create unaware date.
        * @return The converted date
        */
        toZone(zone?: TimeZone): DateTime;
        /**
        * Convert to JavaScript date with the zone time in the getX() methods.
        * Unless the timezone is local, the Date.getUTCX() methods will NOT be correct.
        */
        toDate(): Date;
        /**
        * Add a time duration. Note that this simply adds a number
        * of milliseconds to UTC and converts back to zone(),
        * so in the presence of e.g. leap seconds there may be a
        * shift in the seconds field if you add an hour.
        * There is not DST handling and no leap second handling.
        * @return this + duration
        */
        add(duration: Duration): DateTime;
        /**
        * Add an amount of time to UTC, taking leap seconds etc into account.
        * Adding e.g. 1 hour will increment the utcHour() field
        * date by one. In case of DST changes, the local hour() field
        * may not increase or increase by 2 hours. So if you add a month, the
        * local time may vary by an hour. There will not be a shift
        * in seconds due to leap seconds.
        */
        add(amount: number, unit: TimeUnit): DateTime;
        /**
        * Add an amount of time to the zone time, as regularly as possible.
        * Adding e.g. 1 hour will increment the hour() field of the zone
        * date by one. In case of DST changes, the utcHour() field may
        * increase by 1 or increase by 2. Adding a day will leave the time portion
        * intact. However, adding an hour around a forward DST change adds two hours,
        * since there is a zone time (2AM in Holland) that does not exist.
        */
        addLocal(amount: number, unit: TimeUnit): DateTime;
        /**
        * Same as add(-1*duration);
        */
        sub(duration: Duration): DateTime;
        /**
        * Same as add(-1*amount, unit);
        */
        sub(amount: number, unit: TimeUnit): DateTime;
        /**
        * Same as addLocal(-1*amount, unit);
        */
        subLocal(amount: number, unit: TimeUnit): DateTime;
        /**
        * Time difference between two DateTimes
        * @return this - other
        */
        diff(other: DateTime): Duration;
        /**
        * @return True iff (this < other)
        */
        lessThan(other: DateTime): boolean;
        /**
        * @return True iff (this <= other)
        */
        lessEqual(other: DateTime): boolean;
        /**
        * @return True iff this and other represent the same time in UTC
        */
        equals(other: DateTime): boolean;
        /**
        * @return True iff this and other represent the same time and
        * have the same zone
        */
        identical(other: DateTime): boolean;
        /**
        * @return True iff this > other
        */
        greaterThan(other: DateTime): boolean;
        /**
        * @return True iff this >= other
        */
        greaterEqual(other: DateTime): boolean;
        /**
        * Proper ISO 8601 format string with any IANA zone converted to ISO offset
        * E.g. "2014-01-01T23:15:33+01:00" for Europe/Amsterdam
        */
        toIsoString(): string;
        /**
        * Modified ISO 8601 format string with IANA name if applicable.
        * E.g. "2014-01-01T23:15:33.000 Europe/Amsterdam"
        */
        toString(): string;
        /**
        * Modified ISO 8601 format string in UTC without time zone info
        */
        toUtcString(): string;
    }
    /**
    * Specifies how the period should repeat across the day
    * during DST changes.
    */
    export enum PeriodDst {
        /**
        * Keep repeating in similar intervals measured in UTC,
        * unaffected by Daylight Saving Time.
        * E.g. a repetition of one hour will take one real hour
        * every time, even in a time zone with DST.
        * Leap seconds, leap days and month length
        * differences will still make the intervals different.
        */
        RegularIntervals = 0,
        /**
        * Ensure that the time at which the intervals occur stay
        * at the same place in the day, local time. So e.g.
        * a period of one day, starting at 8:05AM Europe/Amsterdam time
        * will always start at 8:05 Europe/Amsterdam. This means that
        * in UTC time, some intervals will be 25 hours and some
        * 23 hours during DST changes.
        * Another example: an hourly interval will be hourly in local time,
        * skipping an hour in UTC for a DST backward change.
        */
        RegularLocalTime = 1,
    }
    /**
    * Convert a PeriodDst to a string: "regular intervals" or "regular local time"
    */
    export function periodDstToString(p: PeriodDst): string;
    /**
    * Repeating time period: consists of a starting point and
    * a time length. This class accounts for leap seconds and leap days.
    */
    export class Period {
        /**
        * Constructor
        * LIMITATION: if dst equals RegularLocalTime, and unit is Second, Minute or Hour,
        * then the amount must be a factor of 24. So 120 seconds is allowed while 121 seconds is not.
        * This is due to the enormous processing power required by these cases. They are not
        * implemented and you will get an assert.
        *
        * @param start The start of the period. If the period is in Months or Years, and
        *				the day is 29 or 30 or 31, the results are maximised to end-of-month.
        * @param amount	The amount of units.
        * @param unit	The unit.
        * @param dst	Specifies how to handle Daylight Saving Time. Not relevant
        *				if the time zone of the start datetime does not have DST.
        */
        constructor(start: DateTime, amount: number, unit: TimeUnit, dst: PeriodDst);
        /**
        * The start date
        */
        start(): DateTime;
        /**
        * The amount of units
        */
        amount(): number;
        /**
        * The unit
        */
        unit(): TimeUnit;
        /**
        * The dst handling mode
        */
        dst(): PeriodDst;
        /**
        * The first occurrence of the period greater than
        * the given date. The given date need not be at a period boundary.
        * Pre: the fromdate and startdate must either both have timezones or not
        * @param fromDate: the date after which to return the next date
        * @return the first date matching the period after fromDate, given
        *			in the same zone as the fromDate.
        */
        findFirst(fromDate: DateTime): DateTime;
        /**
        * Returns the next timestamp in the period. The given timestamp must
        * be at a period boundary, otherwise the answer is incorrect.
        * This function has MUCH better performance than findFirst.
        * Returns the datetime "count" times away from the given datetime.
        * @param prev	Boundary date. Must have a time zone (any time zone) iff the period start date has one.
        * @param count	Optional, must be >= 1 and whole.
        * @return (prev + count * period), in the same timezone as prev.
        */
        findNext(prev: DateTime, count?: number): DateTime;
        /**
        * Returns an ISO duration string
        * P[n]Y[n]M[n]DT[n]H[n]M[n][.n]S or P[n]W
        */
        toIsoString(): string;
        /**
        * A string representation e.g.
        * "10 years, starting at 2014-03-01T12:00:00 Europe/Amsterdam keeping regular intervals".
        */
        toString(): string;
    }
}

