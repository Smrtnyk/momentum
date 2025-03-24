import { describe, expect, it } from "vitest";

import {
    betweenValues,
    nonZeroPositive,
    positiveNumber,
    positiveRequired,
    required,
} from "./form-validators";

describe("Form Validators", () => {
    describe("betweenValues", () => {
        const validator = betweenValues(5, 10);

        it("returns true for values between min and max", () => {
            expect(validator(5)).toBe(true);
            expect(validator(7.5)).toBe(true);
            expect(validator(10)).toBe(true);
        });

        it("returns error message for values less than min", () => {
            expect(validator(4)).toBe("Must be at least 5");
            expect(validator(0)).toBe("Must be at least 5");
            expect(validator(-1)).toBe("Must be at least 5");
        });

        it("returns error message for values greater than max", () => {
            expect(validator(11)).toBe("Must not exceed 10");
            expect(validator(100)).toBe("Must not exceed 10");
        });

        it("handles numeric strings correctly", () => {
            expect(validator("7")).toBe(true);
            expect(validator("4")).toBe("Must be at least 5");
            expect(validator("11")).toBe("Must not exceed 10");
        });

        it("rejects non-numeric values", () => {
            expect(validator("")).toBe("Value is required");
            expect(validator(null)).toBe("Value is required");
            expect(validator(undefined)).toBe("Value is required");
            expect(validator("abc")).toBe("Must be a valid number");
            expect(validator(Number.NaN)).toBe("Must be a valid number");
        });
    });

    describe("nonZeroPositive", () => {
        it("returns true for positive non-zero values", () => {
            expect(nonZeroPositive(1)).toBe(true);
            expect(nonZeroPositive(0.1)).toBe(true);
            expect(nonZeroPositive(100)).toBe(true);
        });

        it("returns error message for zero", () => {
            expect(nonZeroPositive(0)).toBe("Must be greater than zero");
        });

        it("returns error message for negative values", () => {
            expect(nonZeroPositive(-1)).toBe("Must be greater than zero");
            expect(nonZeroPositive(-0.1)).toBe("Must be greater than zero");
        });

        it("handles numeric strings correctly", () => {
            expect(nonZeroPositive("1")).toBe(true);
            expect(nonZeroPositive("0")).toBe("Must be greater than zero");
            expect(nonZeroPositive("-1")).toBe("Must be greater than zero");
        });

        it("rejects non-numeric values", () => {
            expect(nonZeroPositive("")).toBe("Required");
            expect(nonZeroPositive(null)).toBe("Required");
            expect(nonZeroPositive(undefined)).toBe("Required");
            expect(nonZeroPositive("abc")).toBe("Must be a valid number");
            expect(nonZeroPositive(Number.NaN)).toBe("Must be a valid number");
        });
    });

    describe("positiveNumber", () => {
        it("returns true for positive values", () => {
            expect(positiveNumber(1)).toBe(true);
            expect(positiveNumber(0.1)).toBe(true);
            expect(positiveNumber(100)).toBe(true);
        });

        it("returns true for zero", () => {
            expect(positiveNumber(0)).toBe(true);
        });

        it("returns error message for negative values", () => {
            expect(positiveNumber(-1)).toBe("Must be zero or positive");
            expect(positiveNumber(-0.1)).toBe("Must be zero or positive");
        });

        it("handles numeric strings correctly", () => {
            expect(positiveNumber("1")).toBe(true);
            expect(positiveNumber("0")).toBe(true);
            expect(positiveNumber("-1")).toBe("Must be zero or positive");
        });

        it("rejects non-numeric values", () => {
            expect(positiveNumber("")).toBe("Value is required");
            expect(positiveNumber(null)).toBe("Value is required");
            expect(positiveNumber(undefined)).toBe("Value is required");
            expect(positiveNumber("abc")).toBe("Must be a valid number");
            expect(positiveNumber(Number.NaN)).toBe("Must be a valid number");
        });
    });

    describe("positiveRequired", () => {
        it("returns true for positive values", () => {
            expect(positiveRequired(1)).toBe(true);
            expect(positiveRequired(0.1)).toBe(true);
            expect(positiveRequired(100)).toBe(true);
        });

        it("returns error message for zero", () => {
            expect(positiveRequired(0)).toBe("Must be positive");
        });

        it("returns error message for negative values", () => {
            expect(positiveRequired(-1)).toBe("Must be positive");
            expect(positiveRequired(-0.1)).toBe("Must be positive");
        });

        it("handles numeric strings correctly", () => {
            expect(positiveRequired("1")).toBe(true);
            expect(positiveRequired("0")).toBe("Must be positive");
            expect(positiveRequired("-1")).toBe("Must be positive");
        });

        it("rejects non-numeric values", () => {
            expect(positiveRequired("")).toBe("Required");
            expect(positiveRequired(null)).toBe("Required");
            expect(positiveRequired(undefined)).toBe("Required");
            expect(positiveRequired("abc")).toBe("Must be a valid number");
            expect(positiveRequired(Number.NaN)).toBe("Must be a valid number");
        });
    });

    describe("required", () => {
        it("returns true for truthy values", () => {
            expect(required("hello")).toBe(true);
            expect(required(1)).toBe(true);
            expect(required(true)).toBe(true);
            expect(required([])).toBe(true);
            expect(required({})).toBe(true);
        });

        it("returns true for zero", () => {
            expect(required(0)).toBe(true);
        });

        it("returns error message for falsy values", () => {
            expect(required("")).toBe("Required");
            expect(required(null)).toBe("Required");
            expect(required(undefined)).toBe("Required");
            expect(required(false)).toBe("Required");
        });
    });
});
