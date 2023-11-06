export function toArray(value: any): any {
    if (value === undefined || value === null) {
        return value;
    }
    return Array.from(value);
}

const LABEL = "[Acacia]:";
export const acacia = {
    info(...message: any) {
        console.info(LABEL, ...message)
    },
    warn(...message: any) {
        console.warn(LABEL, ...message)
    },
    error(...message: any) {
        console.error(LABEL, ...message)
    }
}