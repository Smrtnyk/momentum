export function positiveNumber(value: number): boolean | string {
    return value >= 0 || "Must be zero or positive";
}

export function required(value: unknown): boolean | string {
    return Boolean(value) || "Required";
}
