export function toArray(value: any): any {
    if (value === undefined || value === null) {
        return value;
    }
    return Array.from(value);
}