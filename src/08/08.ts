import { leastCommonMultiple } from "@/utils";

class Instructions {
    value: number;
    constructor(rightLeft: string) {
        if (rightLeft === "R") {
            this.value = 1;
        } else {
            this.value = 0;
        }
    }
    toString() {
        return this.value === 1 ? "R" : "L";
    }
}

function parseInput(input: string) {
    const splits = input.split("\n\n");
    const instructions =
        ((splits[0] ?? "").split("\n") ?? [])[0]
            ?.split("")
            .map(x => new Instructions(x)) ?? [];
    const map: Record<string, Array<string>> = {};
    const mapLines = (splits[1] ?? "").split("\n") ?? [];
    mapLines.forEach(line => {
        map[line.slice(0, 3)] = [line.slice(7, 10), line.slice(12, 15)];
    });
    return { instructions, map };
}

export function partOne(input: string) {
    const { instructions, map } = parseInput(input);
    let count = 0;
    let location = "AAA";
    while (location !== "ZZZ") {
        const [first, second] = map[location] ?? [];
        const instruction =
            instructions.at(count % instructions.length) ??
            new Instructions("B");
        location = instruction.value === 1 ? second ?? "111" : first ?? "111";
        count += 1;
    }
    return count;
}

export function partTwo(input: string) {
    const { instructions, map } = parseInput(input);
    let locations = Object.keys(map).filter(x => x.endsWith("A"));
    const findZCounts = locations.map(location => {
        let count = 0;
        let tempLocation = location;
        while (!tempLocation.endsWith("Z")) {
            const [first, second] = map[tempLocation] ?? [];
            const instruction =
                instructions.at(count % instructions.length) ??
                new Instructions("B");
            tempLocation =
                instruction.value === 1 ? second ?? "111" : first ?? "111";
            count += 1;
        }
        return count;
    });
    const lcm = findZCounts.reduce((a, b) => leastCommonMultiple(a, b));
    return lcm;
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
