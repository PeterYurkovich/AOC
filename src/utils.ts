export function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function isNumeric(input: string): boolean {
    return !isNaN(parseInt(input));
}
