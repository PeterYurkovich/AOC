import { isNumeric } from "@/utils";

class Card {
    public cardValue: number;
    constructor(
        input: string,
        public jWild = false,
    ) {
        if (isNumeric(input)) {
            this.cardValue = parseInt(input);
        } else {
            switch (input) {
                case "T":
                    this.cardValue = 10;
                    break;
                case "J":
                    this.cardValue = jWild ? 0 : 11;
                    break;
                case "Q":
                    this.cardValue = 12;
                    break;
                case "K":
                    this.cardValue = 13;
                    break;
                case "A":
                    this.cardValue = 14;
                    break;
                default:
                    this.cardValue = -1;
            }
        }
    }
    compare(other: Card): number {
        return this.cardValue - other.cardValue;
    }

    toString(): string {
        return `${this.cardValue}`;
    }
}

class HandType {
    public value: number;
    constructor(name: string) {
        const values = {
            "High Card": 0,
            "One Pair": 1,
            "Two Pair": 2,
            "Three of a Kind": 3,
            "Full House": 4,
            "Four of a Kind": 5,
            "Five of a Kind": 6,
        } as Record<string, number>;
        this.value = values[name] ?? -1;
    }
    compare(other: HandType): number {
        return this.value - other.value;
    }
    toString(): string {
        return `${this.value}`;
    }
}

class Hand {
    public type: HandType;
    constructor(
        public cards: Card[],
        public bet: number,
        public jWild = false,
    ) {
        this.type = this.getWrappedType();
    }

    toString(): string {
        return `\n${this.cards.join(",")} | ${this.bet} | ${this.type}`;
    }
    getCounts(): Record<number, number> {
        return this.cards.reduce(
            (acc, card) => {
                acc[card.cardValue] = (acc[card.cardValue] ?? 0) + 1;
                return acc;
            },
            {} as Record<number, number>,
        );
    }
    getType(): HandType {
        const counts = this.getCounts();
        let hasThree = false;
        let hasTwo = false;
        delete counts[0];
        for (const [key, value] of Object.entries(counts)) {
            if (value === 5) {
                return new HandType("Five of a Kind");
            }
            if (value === 4) {
                return new HandType("Four of a Kind");
            }
            if ((value === 3 && hasTwo) || (value === 2 && hasThree)) {
                return new HandType("Full House");
            }
            if (value === 3) {
                hasThree = true;
            }
            if (value === 2 && hasTwo) {
                return new HandType("Two Pair");
            }
            if (value === 2) {
                hasTwo = true;
            }
        }
        if (hasThree) {
            return new HandType("Three of a Kind");
        }
        if (hasTwo) {
            return new HandType("One Pair");
        }
        return new HandType("High Card");
    }
    getWrappedType(): HandType {
        const jCount = this.getCounts()[0] ?? 0;
        if (jCount === 0) {
            return this.getType();
        }
        // Allow the jCount to be used as a wild card
        const oldType = this.getType();
        if (jCount === 0) {
            return oldType;
        } else if (jCount === 1) {
            if (oldType.value === 0) {
                return new HandType("One Pair");
            } else if (oldType.value === 1) {
                return new HandType("Three of a Kind");
            } else if (oldType.value === 2) {
                return new HandType("Full House");
            } else if (oldType.value === 3) {
                return new HandType("Four of a Kind");
            } else if (oldType.value === 5) {
                return new HandType("Five of a Kind");
            } else {
                return oldType;
            }
        } else if (jCount === 2) {
            if (oldType.value === 0) {
                return new HandType("Three of a Kind");
            } else if (oldType.value === 1) {
                return new HandType("Four of a Kind");
            } else if (oldType.value === 3) {
                return new HandType("Five of a Kind");
            } else {
                return oldType;
            }
        } else if (jCount === 3) {
            if (oldType.value === 0) {
                return new HandType("Four of a Kind");
            } else if (oldType.value === 1) {
                return new HandType("Five of a Kind");
            } else {
                return oldType;
            }
        } else if (jCount === 4) {
            if (oldType.value === 0) {
                return new HandType("Five of a Kind");
            } else {
                return oldType;
            }
        } else {
            return new HandType("Five of a Kind");
        }
    }
    compare(other: Hand): number {
        const typeCompare = this.type.compare(other.type);
        if (typeCompare !== 0) {
            return typeCompare;
        }
        for (let i = 0; i < this.cards.length; i++) {
            const thisCard = this.cards[i] ?? new Card("G", this.jWild);
            const otherCard = other.cards[i] ?? new Card("G", other.jWild);
            const cardCompare = thisCard.compare(otherCard);
            if (cardCompare !== 0) {
                return cardCompare;
            }
        }
        return 0;
    }
}

function parseCamelOne(input: string): Hand[] {
    return input.split("\n").map(line => {
        const parts = line.split(" ");
        return new Hand(
            (parts[0] ?? "").split("").map(num => new Card(num, false)),
            parseInt(parts[1] ?? ""),
        );
    });
}

function parseCamelTwo(input: string): Hand[] {
    return input.split("\n").map(line => {
        const parts = line.split(" ");
        return new Hand(
            (parts[0] ?? "").split("").map(num => new Card(num, true)),
            parseInt(parts[1] ?? ""),
        );
    });
}

export function partOne(input: string) {
    return parseCamelOne(input)
        .sort((a, b) => a.compare(b))
        .map((hand, i) => hand.bet * (i + 1))
        .reduce((a, b) => a + b, 0);
}

export function partTwo(input: string): number {
    return parseCamelTwo(input)
        .sort((a, b) => a.compare(b))
        .map((hand, i) => hand.bet * (i + 1))
        .reduce((a, b) => a + b, 0);
}

export const testResults = {
    partOne: 1,
    partTwo: 1,
};
