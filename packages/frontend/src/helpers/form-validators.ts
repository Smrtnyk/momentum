export function betweenValues(min: number, max: number) {
    return function (value: unknown): boolean | string {
        if (value === null || value === undefined || value === "") {
            return "Value is required";
        }

        const numValue = typeof value === "string" ? Number(value) : value;

        if (typeof numValue !== "number" || Number.isNaN(numValue)) {
            return "Must be a valid number";
        }

        if (numValue < min) return `Must be at least ${min}`;
        if (numValue > max) return `Must not exceed ${max}`;
        return true;
    };
}

export function nonZeroPositive(value: unknown): boolean | string {
    if (value === null || value === undefined || value === "") {
        return "Required";
    }

    const numValue = typeof value === "string" ? Number(value) : value;

    if (typeof numValue !== "number" || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue > 0 || "Must be greater than zero";
}

export function positiveNumber(value: unknown): boolean | string {
    if (value === null || value === undefined || value === "") {
        return "Value is required";
    }

    const numValue = typeof value === "string" ? Number(value) : value;

    if (typeof numValue !== "number" || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue >= 0 || "Must be zero or positive";
}

export function positiveRequired(value: unknown): boolean | string {
    if (value === null || value === undefined || value === "") {
        return "Required";
    }

    const numValue = typeof value === "string" ? Number(value) : value;

    if (typeof numValue !== "number" || Number.isNaN(numValue)) {
        return "Must be a valid number";
    }

    return numValue > 0 || "Must be positive";
}

export function required(value: unknown): boolean | string {
    if (value === 0) return true;

    return Boolean(value) || "Required";
}
