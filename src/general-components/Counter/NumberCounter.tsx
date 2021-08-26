import {CounterInterface} from "./CounterInterface";

export default class NumberCounter implements CounterInterface {

    get(index: number): string | null {
        return String(index);
    }

}