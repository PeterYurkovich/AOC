import { range } from "../utils";

class race {
    constructor(
        public time: number,
        public distance: number,
    ) {}
    toString() {
        return `time: ${this.time}, distance: ${this.distance}`;
    }
    solve() {
        const times = range(this.time);
        const distances = times.map(time => {
            const speed = time;
            const remainingTime = this.time - time;
            const distance = speed * remainingTime;
            return distance;
        });
        return distances.filter(distance => distance > this.distance);
    }
}

function parseInputOne(input: string) {
    const val = input
        .split("\n")
        .map(line => line.split(":")[1].split(/\s+/).slice(1));
    const races: Array<race> = [];
    val[0].forEach((time, index) => {
        races.push(new race(parseInt(time), parseInt(val[1][index])));
    });
    return races;
}

function parseInputTwo(input: string) {
    const val = input
        .split("\n")
        .map(line => line.split(":")[1].replace(/\s/g, ""));
    return new race(parseInt(val[0]), parseInt(val[1]));
}

export function partOne(input: string) {
    const inputValues = parseInputOne(input);
    return inputValues.map(race => race.solve().length).reduce((a, b) => a * b);
}

export function partTwo(input: string) {
    const inputValues = parseInputTwo(input);
    return inputValues.solve().length;
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
