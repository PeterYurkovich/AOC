const maxColors = {
    red: 12,
    green: 13,
    blue: 14,
};

export function partOne(input: string): Number {
    const games = input.split("\n").map(line => {
        const lineSplit = line.split(":");
        const id = Number(lineSplit[0].split(" ")[1]);
        const rounds = lineSplit[1].split(";");
        const roundResult = rounds
            .map(round => {
                return round
                    .split(",")
                    .map(roundColor => {
                        const colorSplit = roundColor.split(" ");
                        const number = Number(colorSplit[1]);
                        const color = colorSplit[2];
                        return number > maxColors[color];
                    })
                    .reduce((acc, curr) => acc || curr, false);
            })
            .reduce((acc, curr) => acc || curr, false);
        return {
            id,
            roundResult,
        };
    });
    const lostGames = games.filter(game => !game.roundResult);
    const lostGameIds = lostGames.map(game => game.id);
    const lostGameIdsSum = lostGameIds.reduce((acc, curr) => acc + curr, 0);
    return lostGameIdsSum;
}

export function partTwo(input: string): number {
    const games = input.split("\n").map(line => {
        const lineSplit = line.split(":");
        const id = Number(lineSplit[0].split(" ")[1]);
        const rounds = lineSplit[1].split(";");
        const colors = rounds.map(round => {
            const roundColors = {
                red: 0,
                green: 0,
                blue: 0,
            };
            round.split(",").forEach(roundColor => {
                const colorSplit = roundColor.split(" ");
                const number = Number(colorSplit[1]);
                const color = colorSplit[2];
                roundColors[color] = number;
            });
            return roundColors;
        });
        const minColorNumber = colors.reduce(
            (acc, curr) => {
                const res = { ...acc };
                if (curr.red > acc.red && curr.red !== 0) {
                    res.red = curr.red;
                }
                if (curr.green > acc.green && curr.green !== 0) {
                    res.green = curr.green;
                }
                if (curr.blue > acc.blue && curr.blue !== 0) {
                    res.blue = curr.blue;
                }
                return res;
            },
            {
                red: 0,
                green: 0,
                blue: 0,
            },
        );
        return {
            id,
            round: minColorNumber,
        };
    });
    const idPower = games.map(game => {
        return {
            id: game.id,
            power: game.round.red * game.round.green * game.round.blue,
        };
    });
    const sumPower = idPower.reduce((acc, curr) => acc + curr.power, 0);
    return sumPower;
}

export const testResults = {
    partOne: 8,
    partTwo: 2286,
};
