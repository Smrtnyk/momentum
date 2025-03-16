export function betweenValues(min: number, max: number) {
    return function (value: number): boolean | string {
        if (value < min) return `Must be at least ${min}`;
        if (value > max) return `Must not exceed ${max}`;
        return true;
    };
}

export function hasItems(value: unknown[]): boolean | string {
    return value.length > 0 || "Select at least one item";
}

export function positiveNumber(value: number): boolean | string {
    return value >= 0 || "Must be zero or positive";
}

export function positiveRequired(value: number): boolean | string {
    if (!value && value !== 0) return "Required";
    return value > 0 || "Must be positive";
}

export function required(value: unknown): boolean | string {
    return Boolean(value) || "Required";
}
