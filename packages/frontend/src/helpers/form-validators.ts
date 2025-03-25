import { isNil, isString } from "es-toolkit";
import { isNumber } from "es-toolkit/compat";

export function betweenValues(min: number, max: number) {
    return function (value: unknown): boolean | string {
        if (isNil(value) || value === "") {
            return "Value is required";
        }

        const numValue = isString(value) ? Number(value) : value;

        if (!isNumber(numValue) || Number.isNaN(numValue)) {
            return "Must be a valid number";
        }

        if (numValue < min) return `Must be at least ${min}`;
        if (numValue > max) return `Must not exceed ${max}`;
        return true;
    };
}

export function nonZeroPositive(value: unknown): boolean | string {
    if (isNil(value) || value === "") {
        return "Required";
    }

    const numValue = isString(value) ? Number(value) : value;

    if (!isNumber(numValue) || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue > 0 || "Must be greater than zero";
}

export function positiveNumber(value: unknown): boolean | string {
    if (isNil(value) || value === "") {
        return "Value is required";
    }

    const numValue = isString(value) ? Number(value) : value;

    if (!isNumber(numValue) || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue >= 0 || "Must be zero or positive";
}

export function positiveRequired(value: unknown): boolean | string {
    if (isNil(value) || value === "") {
        return "Required";
    }

    const numValue = isString(value) ? Number(value) : value;

    if (!isNumber(numValue) || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue > 0 || "Must be positive";
}

export function required(value: unknown): boolean | string {
    if (value === 0) return true;

    return Boolean(value) || "Required";
}
