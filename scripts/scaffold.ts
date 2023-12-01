import chalk from "chalk";
import dedent from "dedent";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";

import { fetchInput } from "./api.ts";

export async function scaffold(day: number, year: number) {
    const name = `${day}`.padStart(2, "0");

    const directory = new URL(`../src/${name}/`, import.meta.url);

    if (existsSync(directory)) return;

    console.log(`📂 Setting up day ${day} of ${year}`);

    await mkdir(directory);

    const solution = dedent`
    export function partOne(input: string): number {
        return 0;
    }
    
    export function partTwo(input: string): number {
        return 0;
    }
    
    export const testResults = {
        partOne: 0,
        partTwo: 0,
    };
    `;

    console.log(`📂 Fetching your input`);

    const input = await fetchInput({ day, year }).catch(() => {
        console.log(
            chalk.red.bold(
                "📂 Fetching your input have failed, empty file will be created.",
            ),
        );
    });

    await Bun.write(new URL(`${name}.ts`, directory.href), solution);
    await Bun.write(new URL(`input.txt`, directory.href), input ?? "");
    await Bun.write(new URL(`exampleA.txt`, directory.href), "");
    await Bun.write(new URL(`exampleB.txt`, directory.href), "");

    console.log("📂 You all set up, have fun!");
}
