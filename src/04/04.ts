function range(size: number, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

export function partOne(input: string) {
    const cards = input
        .split("\n")
        .map(line => line.split(":")[1] ?? "")
        .map(line => {
            const split = line.split("|");
            return {
                winners: (split[0] ?? "").split(/\s+/).slice(1).map(Number),
                options: (split[1] ?? "").split(/\s+/).slice(1).map(Number),
            };
        });
    const winningNumbers = cards.map(card => {
        const { winners, options } = card;
        const winningOptions = options.filter(option =>
            winners.includes(option),
        );
        return winningOptions;
    });
    const winningValues = winningNumbers.map(numbers =>
        numbers.reduce((a, b) => (a === 0 ? 1 : a * 2), 0),
    );
    return winningValues.reduce((a, b) => a + b, 0);
}

export function partTwo(input: string) {
    const cards = input
        .split("\n")
        .map(line => line.split(":")[1] ?? "")
        .map(line => {
            const split = line.split("|");
            return {
                winners: (split[0] ?? "").split(/\s+/).slice(1).map(Number),
                options: (split[1] ?? "").split(/\s+/).slice(1).map(Number),
            };
        });
    const cardTrain = [...range(cards.length, 1)];
    const cardResult = {};
    let evaluatedCards = 0;
    while (cardTrain.length > 0) {
        evaluatedCards += 1;
        const card = cardTrain.shift() ?? 0;
        if (card in cardResult) {
            cardTrain.push(...cardResult[String(card)]);
            continue;
        }
        const { winners, options } = cards[card - 1] ?? {
            winners: [],
            options: [],
        };
        const winningOptions = options.filter(option =>
            winners.includes(option),
        );
        cardResult[String(card)] = [...range(winningOptions.length, card + 1)];
        cardTrain.push(...range(winningOptions.length, card + 1));
    }
    return evaluatedCards;
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
