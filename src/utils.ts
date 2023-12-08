export function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function zerosArray(size: number) {
    return [...Array(size).keys()].map(i => 0);
}

export function isNumeric(input: string): boolean {
    return !isNaN(parseInt(input));
}

export function greatestCommonDivisor(a: number, b: number): number {
    if (b === 0) {
        return a;
    }
    return greatestCommonDivisor(b, a % b);
}

export function leastCommonMultiple(a: number, b: number): number {
    return (a * b) / greatestCommonDivisor(a, b);
}
