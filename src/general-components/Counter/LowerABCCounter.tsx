import {CounterInterface} from "./CounterInterface";

export default class LowerABCCounter implements CounterInterface {
    private readonly alphabet = new Array<string>();

    constructor() {
        this.alphabet = new Array(26).fill(1).map((_, i) => String.fromCharCode(97 + i));
    }

    get(index: number): string | null {
        if (index > 0) {
            if (index <= this.alphabet.length) {
                return this.alphabet[index - 1];
            }
        }
        return null;
    }

}