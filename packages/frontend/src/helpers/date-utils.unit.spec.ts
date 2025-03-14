import { Timestamp } from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    formatDateWithDay,
    formatFullDate,
    formatISODate,
    formatRelativeDate,
    formatShortDate,
    getDateFromMaybeTimestamp,
    getDateRangeDisplayName,
    getDateRangeFromOption,
    getDaysBetween,
    getShortDateRangeDisplayName,
    getStartOfToday,
    getWeekStart,
    isToday,
    ONE_DAY,
    ONE_HOUR,
    timestampToDate,
} from "./date-utils";

vi.hoisted(() => {
    vi.stubEnv("TZ", "UTC");
    vi.stubEnv("TC_ALL", "en_US.UTF-8");
    vi.spyOn(globalThis.Intl, "DateTimeFormat").mockImplementation(
        () =>
            ({
                resolvedOptions: () => ({
                    locale: "en-US",
                }),
            }) as any,
    );
});

describe("date-utils", () => {
    const fixedDate = new Date(2023, 4, 15, 12, 0, 0);

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(fixedDate);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("formatDateWithDay", () => {
        it("formats date with weekday, month, and day", () => {
            // March 10, 2023 (Friday)
            const testDate = new Date(2023, 2, 10);
            expect(formatDateWithDay(testDate)).toMatch(/fri, mar 10/i);
        });
    });

    describe("formatFullDate", () => {
        it("formats date with month, day, and year", () => {
            // March 10, 2023
            const testDate = new Date(2023, 2, 10);
            expect(formatFullDate(testDate)).toMatch(/mar 10, 2023/i);
        });
    });

    describe("formatISODate", () => {
        it("formats date as ISO string (YYYY-MM-DD)", () => {
            // March 10, 2023
            const testDate = new Date(2023, 2, 10);
            expect(formatISODate(testDate)).toBe("2023-03-10");
        });
    });

    describe("formatRelativeDate", () => {
        it('returns "Today" for current day', () => {
            // Same as  fixed date
            const today = new Date(2023, 4, 15);
            expect(formatRelativeDate(today)).toBe("Today");
        });

        it('returns "Yesterday" for previous day', () => {
            const yesterday = new Date(2023, 4, 14);
            expect(formatRelativeDate(yesterday)).toBe("Yesterday");
        });

        it('returns "X days ago" for recent dates', () => {
            const threeDaysAgo = new Date(2023, 4, 12);
            expect(formatRelativeDate(threeDaysAgo)).toBe("3 days ago");
        });

        it("returns formatted date for older dates", () => {
            // April 1, 2023
            const oldDate = new Date(2023, 3, 1);
            expect(formatRelativeDate(oldDate)).toMatch(/apr 1/i);
        });
    });

    describe("formatShortDate", () => {
        it("formats date as M/D", () => {
            // March 10, 2023
            const testDate = new Date(2023, 2, 10);
            expect(formatShortDate(testDate)).toBe("3/10");
        });
    });

    describe("getDateFromMaybeTimestamp", () => {
        it("handles Date objects", () => {
            const date = new Date(2023, 2, 10);
            expect(getDateFromMaybeTimestamp(date)).toEqual(date);
        });

        it("handles string dates", () => {
            const dateStr = "2023-03-10";
            const result = getDateFromMaybeTimestamp(dateStr);
            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toContain("2023-03-10");
        });

        it("handles Timestamp objects", () => {
            // March 10, 2023
            const timestamp = Timestamp.fromMillis(1_678_406_400 * 1000);
            const result = getDateFromMaybeTimestamp(timestamp);
            expect(result).toBeInstanceOf(Date);
        });
    });

    describe("getDateRangeDisplayName", () => {
        it("returns display names for all options", () => {
            expect(getDateRangeDisplayName("allTime")).toBe("All Time");
            expect(getDateRangeDisplayName("last6Months")).toBe("Last 6 Months");
            expect(getDateRangeDisplayName("last7Days")).toBe("Last 7 Days");
            expect(getDateRangeDisplayName("last30Days")).toBe("Last 30 Days");
            expect(getDateRangeDisplayName("last90Days")).toBe("Last 90 Days");
            expect(getDateRangeDisplayName("lastYear")).toBe("Last Year");
            expect(getDateRangeDisplayName("custom" as any)).toBe("Custom");
        });
    });

    describe("getDateRangeFromOption", () => {
        it("returns correct range for last7Days", () => {
            const range = getDateRangeFromOption("last7Days");

            expect(range.endDate.getDate()).toBe(15);
            expect(range.startDate.getDate()).toBe(9);
            expect(getDaysBetween(range.startDate, range.endDate)).toBe(6);
        });

        it("returns correct range for last30Days", () => {
            const range = getDateRangeFromOption("last30Days");
            expect(getDaysBetween(range.startDate, range.endDate)).toBe(29);
        });

        it("returns correct range for last90Days", () => {
            const range = getDateRangeFromOption("last90Days");
            expect(getDaysBetween(range.startDate, range.endDate)).toBe(89);
        });

        it("returns correct range for last6Months", () => {
            const range = getDateRangeFromOption("last6Months");
            // November
            expect(range.startDate.getMonth()).toBe(10);
            expect(range.startDate.getFullYear()).toBe(2022);
        });

        it("returns correct range for lastYear", () => {
            const range = getDateRangeFromOption("lastYear");
            expect(range.startDate.getFullYear()).toBe(2022);
            expect(range.endDate.getFullYear()).toBe(2023);
        });

        it("returns correct range for allTime", () => {
            const range = getDateRangeFromOption("allTime");
            expect(range.startDate.getFullYear()).toBe(2000);
        });
    });

    describe("getDaysBetween", () => {
        it("calculates days between two dates", () => {
            const startDate = new Date(2023, 4, 10);
            const endDate = new Date(2023, 4, 15);
            expect(getDaysBetween(startDate, endDate)).toBe(5);
        });

        it("returns 0 for same day", () => {
            const date = new Date(2023, 4, 15);
            expect(getDaysBetween(date, date)).toBe(0);
        });

        it("handles negative spans correctly", () => {
            const startDate = new Date(2023, 4, 15);
            const endDate = new Date(2023, 4, 10);
            expect(getDaysBetween(startDate, endDate)).toBe(-5);
        });
    });

    describe("getShortDateRangeDisplayName", () => {
        it("returns short names for all options", () => {
            expect(getShortDateRangeDisplayName("allTime")).toBe("All");
            expect(getShortDateRangeDisplayName("last6Months")).toBe("6m");
            expect(getShortDateRangeDisplayName("last7Days")).toBe("7d");
            expect(getShortDateRangeDisplayName("last30Days")).toBe("30d");
            expect(getShortDateRangeDisplayName("last90Days")).toBe("90d");
            expect(getShortDateRangeDisplayName("lastYear")).toBe("1y");
            expect(getShortDateRangeDisplayName("custom" as any)).toBe("Custom");
        });
    });

    describe("getStartOfToday", () => {
        it("returns today with time set to 00:00:00", () => {
            const result = getStartOfToday();
            expect(result.getDate()).toBe(15);
            expect(result.getMonth()).toBe(4);
            expect(result.getFullYear()).toBe(2023);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
        });
    });

    describe("getWeekStart", () => {
        it("returns Sunday for the week containing the date", () => {
            // May 15, 2023 is a Monday
            const monday = new Date(2023, 4, 15);
            const result = getWeekStart(monday);

            // May 14, 2023 is the Sunday before
            expect(result.getDate()).toBe(14);
            expect(result.getMonth()).toBe(4);
            expect(result.getFullYear()).toBe(2023);
        });

        it("returns the same date if it is already Sunday", () => {
            const sunday = new Date(2023, 4, 14);
            const result = getWeekStart(sunday);

            expect(result.getDate()).toBe(14);
            expect(result.getHours()).toBe(0);
        });
    });

    describe("isToday", () => {
        it("returns true for today", () => {
            const today = new Date(2023, 4, 15);
            expect(isToday(today)).toBe(true);
        });

        it("returns false for other days", () => {
            const otherDay = new Date(2023, 4, 14);
            expect(isToday(otherDay)).toBe(false);
        });

        it("works with Timestamp objects", () => {
            const todayTimestamp = Timestamp.fromMillis(fixedDate.getTime());
            expect(isToday(todayTimestamp)).toBe(true);
        });
    });

    describe("timestampToDate", () => {
        it("converts Timestamp to Date", () => {
            // March 10, 2023
            const timestamp = Timestamp.fromMillis(1_678_406_400 * 1000);
            const result = timestampToDate(timestamp);

            expect(result).toBeInstanceOf(Date);
            expect(result.getTime()).toBe(1_678_406_400 * 1000);
        });
    });

    describe("Constants", () => {
        it("has correct values for constants", () => {
            expect(ONE_DAY).toBe(24 * 60 * 60 * 1000);
            expect(ONE_HOUR).toBe(60 * 60 * 1000);
        });
    });
});
