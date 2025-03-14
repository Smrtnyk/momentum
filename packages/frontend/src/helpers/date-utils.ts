import type { Timestamp } from "firebase/firestore";

import { isString } from "es-toolkit";

import type { DateRange, DateRangeOption } from "../types/analytics";

export const currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;

export const ONE_MINUTE = 60 * 1000;
export const ONE_SECOND = 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const ONE_HOUR = 60 * 60 * 1000;

/**
 * Format a date with weekday, month, and day (Mon, Jan 15)
 */
export function formatDateWithDay(date: Date): string {
    return date.toLocaleDateString(currentLocale, {
        day: "numeric",
        month: "short",
        weekday: "short",
    });
}

/**
 * Format a date with month, day, and year (Jan 15, 2023)
 */
export function formatFullDate(date: Date): string {
    return date.toLocaleDateString(currentLocale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Format a date as ISO string (YYYY-MM-DD)
 */
export function formatISODate(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Format a date with month and day (Jan 15)
 */
export function formatMediumDate(date: Date): string {
    return date.toLocaleDateString(currentLocale, {
        day: "numeric",
        month: "short",
    });
}

/**
 * Format a date relative to today (Today, Yesterday, X days ago, or date)
 */
export function formatRelativeDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / ONE_DAY);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    return formatMediumDate(date);
}

/**
 * Format a date as short date (M/D)
 */
export function formatShortDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function getDateFromMaybeTimestamp(date: Date | string | Timestamp): Date {
    if (isString(date)) return new Date(date);
    if (date instanceof Date) return date;
    return date.toDate();
}

/**
 * Get a display name for a date range option
 */
export function getDateRangeDisplayName(option: DateRangeOption): string {
    switch (option) {
        case "allTime":
            return "All Time";
        case "last6Months":
            return "Last 6 Months";
        case "last7Days":
            return "Last 7 Days";
        case "last30Days":
            return "Last 30 Days";
        case "last90Days":
            return "Last 90 Days";
        case "lastYear":
            return "Last Year";
        default:
            return "Custom";
    }
}

/**
 * Get a date range based on the given option
 */
export function getDateRangeFromOption(option: DateRangeOption): DateRange {
    const endDate = getEndOfToday();
    const startDate = getStartOfToday();

    switch (option) {
        case "allTime":
            startDate.setFullYear(2000);
            break;
        case "last6Months":
            startDate.setMonth(startDate.getMonth() - 6);
            break;
        case "last7Days":
            startDate.setDate(startDate.getDate() - 6);
            break;
        case "last30Days":
            startDate.setDate(startDate.getDate() - 29);
            break;
        case "last90Days":
            startDate.setDate(startDate.getDate() - 89);
            break;
        case "lastYear":
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }

    return { endDate, startDate };
}

/**
 * Get the number of days between two dates
 */
export function getDaysBetween(startDate: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.floor(diffTime / ONE_DAY);
}

/**
 * Get a short display name for a date range option
 */
export function getShortDateRangeDisplayName(option: DateRangeOption): string {
    switch (option) {
        case "allTime":
            return "All";
        case "last6Months":
            return "6m";
        case "last7Days":
            return "7d";
        case "last30Days":
            return "30d";
        case "last90Days":
            return "90d";
        case "lastYear":
            return "1y";
        default:
            return "Custom";
    }
}

/**
 * Get today's date with time set to start of day
 */
export function getStartOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
}

/**
 * Get week start date (Sunday) for a given date
 */
export function getWeekStart(date: Date): Date {
    const result = new Date(date);
    result.setDate(date.getDate() - date.getDay());
    result.setHours(0, 0, 0, 0);
    return result;
}

/**
 * Checks if a Date object or Timestamp represents today
 */
export function isToday(date: Date | Timestamp): boolean {
    const dateToCheck = date instanceof Date ? date : date.toDate();
    const today = new Date();

    return (
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear()
    );
}

/**
 * Convert a Firestore Timestamp to a Date object
 */
export function timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
}

/**
 * Get today's date with time set to end of day
 */
function getEndOfToday(): Date {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
}
