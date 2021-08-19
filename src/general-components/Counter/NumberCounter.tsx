import {CounterInterface} from "./CounterInterface";

export default class NumberCounter implements CounterInterface {
    private readonly numbers = new Array<number>();

    constructor() {
        this.numbers = new Array(26).fill(1).map((_, i) => i);
    }

    get(index: number): string | null {
        if (index > 0) {
            if (index <= this.numbers.length) {
                return String(this.numbers[index]);
            }
        }
        return null;
    }

}