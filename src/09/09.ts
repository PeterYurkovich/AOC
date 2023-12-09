class Pattern {
    constructor(public inputs: number[]) {}
    toString() {
        return this.inputs.join(" ");
    }
    solve() {
        return this.diveDown(this.inputs);
    }
    diveDown(arr: number[] = []): number {
        if (arr.filter(i => i !== 0).length === 0) {
            return 0;
        }
        const changes = [];
        for (let i = 0; i < arr.length - 1; i++) {
            const current = (arr[i + 1] ?? 0) - (arr[i] ?? 0);
            changes.push(current);
        }
        return (arr.at(-1) ?? 0) + this.diveDown(changes);
    }
    solveInverse() {
        return this.diveUp(this.inputs);
    }
    diveUp(arr: number[] = []): number {
        if (arr.filter(i => i !== 0).length === 0) {
            return 0;
        }
        const changes = [];
        for (let i = arr.length - 1; i > 0; i--) {
            const current = (arr[i - 1] ?? 0) - (arr[i] ?? 0);
            changes.unshift(current);
        }
        return (arr[0] ?? 0) + this.diveUp(changes);
    }
}

function parseInput(input: string) {
    return input
        .split("\n")
        .map(line => line.split(/\s+/).map(Number))
        .map(line => new Pattern(line));
}

export function partOne(input: string) {
    return parseInput(input)
        .map(p => p.solve())
        .reduce((a, b) => a + b, 0);
}

export function partTwo(input: string) {
    return parseInput(input)
        .map(p => p.solveInverse())
        .reduce((a, b) => a + b, 0);
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
