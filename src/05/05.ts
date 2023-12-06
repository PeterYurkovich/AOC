import { range } from "@/utils";

class Range {
    constructor(
        public min: number,
        public max: number,
    ) {}
    get size() {
        return this.max - this.min + 1;
    }
    contains(n: number) {
        return n >= this.min && n <= this.max;
    }
    get arr() {
        return range(this.size, this.min);
    }
    overlaps(range: Range): Range | null {
        if (this.min > range.max || range.min > this.max) {
            return null;
        }
        return new Range(
            Math.max(this.min, range.min),
            Math.min(this.max, range.max),
        );
    }
    nonOverlap(range: Range): Array<Range> {
        if (this.min > range.max || range.min > this.max) {
            return [this];
        }
        const overlap = this.overlaps(range);
        if (overlap === null) {
            return [this];
        }
        if (overlap.min === this.min && overlap.max === this.max) {
            return [];
        }
        if (overlap.min === this.min) {
            return [new Range(overlap.max + 1, this.max)];
        }
        if (overlap.max === this.max) {
            return [new Range(this.min, overlap.min - 1)];
        }
        return [
            new Range(this.min, overlap.min - 1),
            new Range(overlap.max + 1, this.max),
        ];
    }
    toString() {
        return `${this.min}-${this.max}`;
    }
}

class RangeMap {
    // seed-to-soil
    constructor(
        public destination: Range,
        public source: Range,
    ) {}
    overlaps(sourceRange: Array<Range>) {
        return sourceRange // [seed]
            .map(range => {
                const overlap = this.source.overlaps(range);
                if (!overlap) {
                    return { source: [range], destination: [] };
                }
                const nonOverlap = range.nonOverlap(this.source);
                return {
                    source: nonOverlap,
                    destination: [this.transform(overlap)],
                };
            })
            .reduce(
                (acc, curr) => {
                    return {
                        source: [...acc.source, ...curr.source],
                        destination: [...acc.destination, ...curr.destination],
                    };
                },
                { source: [], destination: [] },
            );
    }
    toString() {
        return `${this.source.min}, ${this.source.max} -> ${this.destination.min}, ${this.destination.max}`;
    }
    transform(sourceRange: Range) {
        if (!this.source.overlaps(sourceRange)) {
            return sourceRange;
        }
        return new Range(
            this.destination.min + (sourceRange.min - this.source.min),
            this.destination.min + (sourceRange.max - this.source.min),
        );
    }
}

function parseInput(input: string) {
    const splits = input.split("\n\n");
    const seeds = ((splits[0] ?? "").split(":")[1] ?? "")
        .trim()
        .split(" ")
        .map(Number);
    const maps = splits.slice(1).map(s => {
        const eachMap = s.split("\n").slice(1);
        return eachMap.map(m => {
            const [destination_start, source_start, size] = m.split(" ");
            return {
                destination: new Range(
                    parseInt(destination_start ?? "0"),
                    parseInt(destination_start ?? "0") +
                        parseInt(size ?? "0") -
                        1,
                ),
                source: new Range(
                    parseInt(source_start ?? "0"),
                    parseInt(source_start ?? "0") + parseInt(size ?? "0") - 1,
                ),
            };
        });
    });
    return { seeds, maps };
}
function parseInputTwo(input: string) {
    const splits = input.split("\n\n");
    const seedIndividuals = ((splits[0] ?? "").split(":")[1] ?? "")
        .trim()
        .split(" ")
        .map(Number);
    const seeds = [];
    for (let i = 0; i < seedIndividuals.length; i += 2) {
        const seedLocation = seedIndividuals[i] ?? 0;
        const size = seedIndividuals[i + 1] ?? 0;
        seeds.push(new Range(seedLocation, seedLocation + size));
    }
    const maps = splits.slice(1).map(s => {
        const eachMap = s.split("\n").slice(1);
        return eachMap.map(m => {
            const [destination_start, source_start, size] = m.split(" ");
            return new RangeMap(
                new Range(
                    parseInt(destination_start ?? "0"),
                    parseInt(destination_start ?? "0") +
                        parseInt(size ?? "0") -
                        1,
                ),
                new Range(
                    parseInt(source_start ?? "0"),
                    parseInt(source_start ?? "0") + parseInt(size ?? "0") - 1,
                ),
            );
        });
    });
    return { seeds, maps };
}

export function partOne(input: string) {
    const { seeds, maps } = parseInput(input);
    const locations = seeds.map(seed => {
        let currLocation = seed;
        maps.forEach(map => {
            const usableMap = map.find(({ source }) =>
                source.contains(currLocation),
            );
            if (usableMap) {
                currLocation =
                    usableMap.destination.min +
                    (currLocation - usableMap.source.min);
            }
        });
        return currLocation;
    });
    return Math.min(...locations);
}

export function partTwo(input: string) {
    const { seeds, maps } = parseInputTwo(input);
    const locations = seeds.flatMap(seedRange => {
        let seedArr = [seedRange];
        const endMap: Array<Range> = [];
        maps.forEach(mapList => {
            mapList.forEach(map => {
                const mapMap = map.overlaps(seedArr);
                seedArr = mapMap.source;
                endMap.push(...mapMap.destination);
            });
            seedArr = [...seedArr, ...endMap];
            endMap.length = 0;
        });
        return seedArr;
    });

    return locations.sort((a, b) => a.min - b.min)[0]?.min;
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
