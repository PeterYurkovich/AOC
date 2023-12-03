const isInteger = (num: string | undefined) =>
    Number.isInteger(parseInt(num ?? ""));

const findNumberFromPosition = (
    map: Array<Array<string>>,
    y: number,
    x: number,
) => {
    // check as far before and after the current position as possible
    // if there is a number, then return that number

    // check left
    let num = map[y][x];
    let i = x - 1;
    while (i >= 0 && isInteger(map[y][i])) {
        num = map[y][i] + num;
        i--;
    }
    // check right
    i = x + 1;
    while (i < map[y].length && isInteger(map[y][i])) {
        num += map[y][i];
        i++;
    }
    return parseInt(num ?? 0);
};

export function partOne(input: string) {
    // create a 2d array of the input
    const map = input.split("\n").map(line => line.split(""));
    //iterate through the map, finding continuous numbers within a single line
    // and then check if there are non '.' characters which touch that number up down left right or diagonally
    // if there are, then that number is a valid number
    // if there are not, then that number is not a valid number
    // return an array of all valid numbers
    // then return the sum of all valid numbers

    const validNumbers: Array<Number> = [];
    for (let i = 0; i < map.length; i++) {
        const line = map[i] ?? [];
        for (let j = 0; j < line.length; j++) {
            let num = line[j] ?? "*";
            if (!isInteger(num)) {
                continue;
            }
            j++;
            while (i < map.length && isInteger(map.at(i)?.at(j))) {
                num += map.at(i)?.at(j);
                j++;
            }
            const bounds = {
                top: Math.max(i - 1, 0),
                bottom: Math.min(i + 1, map.length - 1),
                left: Math.max(j - num.length - 1, 0),
                right: Math.min(j, line.length - 1),
            };
            let isNumberValid = false;
            for (let k = bounds.top; k <= bounds.bottom; k++) {
                for (let l = bounds.left; l <= bounds.right; l++) {
                    if (
                        map.at(k)?.at(l) !== "." &&
                        !isInteger(map.at(k)?.at(l))
                    ) {
                        // if (num === "755") {
                        //     validNumbers.push(
                        //         "" +
                        //             bounds.top +
                        //             "|" +
                        //             bounds.bottom +
                        //             "|" +
                        //             bounds.left +
                        //             "|" +
                        //             bounds.right,
                        //     );
                        // }
                        isNumberValid = true;
                        break;
                    }
                }
            }
            if (isNumberValid) {
                validNumbers.push(parseInt(num));
            }
        }
    }
    return validNumbers.reduce((acc, cur) => acc + cur, 0);
    // return validNumbers;
}

export function partTwo(input: string): number {
    // create a 2d array of the input
    const map = input.split("\n").map(line => line.split(""));
    //iterate through the map, finding continuous numbers within a single line
    // and then check if there are non '.' characters which touch that number up down left right or diagonally
    // if there are, then that number is a valid number
    // if there are not, then that number is not a valid number
    // return an array of all valid numbers
    // then return the sum of all valid numbers

    const validNumbers: Array<Number> = [];
    for (let i = 0; i < map.length; i++) {
        const line = map[i] ?? [];
        for (let j = 0; j < line.length; j++) {
            if (map.at(i)?.at(j) !== "*") {
                continue;
            }
            // find all valid locations around a star, keeping in mind the bounds of the map
            const bounds = {};
            if (i > 0) {
                if (j > 0) {
                    bounds["topLeft"] = { y: i - 1, x: j - 1 };
                }
                bounds["top"] = { y: i - 1, x: j };
                if (j < line.length - 1) {
                    bounds["topRight"] = { y: i - 1, x: j + 1 };
                }
            }
            if (j > 0) {
                bounds["left"] = { y: i, x: j - 1 };
            }
            if (j < line.length - 1) {
                bounds["right"] = { y: i, x: j + 1 };
            }
            if (i < map.length - 1) {
                if (j > 0) {
                    bounds["bottomLeft"] = { y: i + 1, x: j - 1 };
                }
                bounds["bottom"] = { y: i + 1, x: j };
                if (j < line.length - 1) {
                    bounds["bottomRight"] = { y: i + 1, x: j + 1 };
                }
            }
            const validLocations = [];
            if (
                bounds["top"] &&
                isInteger(map.at(bounds["top"].y)?.at(bounds["top"].x))
            ) {
                validLocations.push(bounds["top"]);
            } else {
                if (
                    bounds["topLeft"] &&
                    isInteger(
                        map.at(bounds["topLeft"].y)?.at(bounds["topLeft"].x),
                    )
                ) {
                    validLocations.push(bounds["topLeft"]);
                }
                if (
                    bounds["topRight"] &&
                    isInteger(
                        map.at(bounds["topRight"].y)?.at(bounds["topRight"].x),
                    )
                ) {
                    validLocations.push(bounds["topRight"]);
                }
            }
            if (
                bounds["left"] &&
                isInteger(map.at(bounds["left"].y)?.at(bounds["left"].x))
            ) {
                validLocations.push(bounds["left"]);
            }
            if (
                bounds["right"] &&
                isInteger(map.at(bounds["right"].y)?.at(bounds["right"].x))
            ) {
                validLocations.push(bounds["right"]);
            }
            if (
                bounds["bottom"] &&
                isInteger(map.at(bounds["bottom"].y)?.at(bounds["bottom"].x))
            ) {
                validLocations.push(bounds["bottom"]);
            } else {
                if (
                    bounds["bottomLeft"] &&
                    isInteger(
                        map
                            .at(bounds["bottomLeft"].y)
                            ?.at(bounds["bottomLeft"].x),
                    )
                ) {
                    validLocations.push(bounds["bottomLeft"]);
                }
                if (
                    bounds["bottomRight"] &&
                    isInteger(
                        map
                            .at(bounds["bottomRight"].y)
                            ?.at(bounds["bottomRight"].x),
                    )
                ) {
                    validLocations.push(bounds["bottomRight"]);
                }
            }
            if (validLocations.length == 2) {
                validNumbers.push(
                    findNumberFromPosition(
                        map,
                        validLocations[0].y,
                        validLocations[0].x,
                    ) *
                        findNumberFromPosition(
                            map,
                            validLocations[1].y,
                            validLocations[1].x,
                        ),
                );
            }
        }
    }
    return validNumbers.reduce((acc, cur) => acc + cur, 0);
    // return validNumbers;
}

export const testResults = {
    partOne: 4361,
    partTwo: 1,
};
