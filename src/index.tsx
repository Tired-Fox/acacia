export * from './aria';
export * from './components';

export function toArray(value: any): any {
    if (value === undefined || value === null) {
        return value;
    }
    return Array.from(value);
}

const LABEL = '[Acacia]:';
export const acacia = {
    info(...message: any) {
        console.info(LABEL, ...message);
    },
    warn(...message: any) {
        console.warn(LABEL, ...message);
    },
    error(...message: any) {
        console.error(LABEL, ...message);
    },
};

/**
 * Random acacia identifier.
 *
 * Generates a random id that can be used for acacia generated id's for linking elements.
 * @returns Random id prefixed with `acacia-`
 */
export function raid(): string {
    return `acacia-${Math.random().toString(16).slice(2)}`;
}
