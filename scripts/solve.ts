import { argv } from "bun";
import chalk from "chalk";
import { formatPerformance, withPerformance, isBetween } from "./utils.ts";
import { scaffold } from "./scaffold.ts";

const day = parseInt(argv[2] ?? "");
const year = parseInt(process.env.YEAR ?? new Date().getFullYear());

if (!isBetween(day, [1, 25])) {
    console.log(
        `🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`,
    );
    console.log(`🎅 To get started, try: ${chalk.cyan("bun solve 1")}`);
    process.exit(0);
}

await scaffold(day, year);

const name = `${day}`.padStart(2, "0");

const { default: input } = await import(`@/${name}/input.txt`);
const { default: exampleA } = await import(`@/${name}/exampleA.txt`);
const { partOne, partTwo, testResults } = await import(`@/${name}/${name}.ts`);

const [oneTest, oneTestPerformance] = withPerformance(() => partOne(exampleA));
const [one, onePerformance] = withPerformance(() => partOne(input));
const [twoTest, twoTestPerformance] = withPerformance(() => partTwo(exampleA));
const [two, twoPerformance] = withPerformance(() => partTwo(input));

console.clear();
console.log(`🎅 Day ${day} of ${year}`);
console.log();
console.log(
    "🌲",
    "Part One:",
    chalk.green(oneTest),
    `(${formatPerformance(oneTestPerformance)})`,
);
console.log(
    "🌲",
    "Part One:",
    chalk.green(one ?? "—"),
    one ? `(${formatPerformance(onePerformance)})` : "",
);
console.log();
console.log(
    "🎄",
    "Part Two:",
    chalk.green(twoTest),
    `(${formatPerformance(twoTestPerformance)})`,
);
console.log(
    "🎄",
    "Part Two:",
    chalk.green(two ?? "—"),
    two ? `(${formatPerformance(twoPerformance)})` : "",
);
