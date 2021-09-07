import {CounterInterface} from "./CounterInterface";


export class NumberCounter implements CounterInterface {

    get(index: number): string | null {
        return String(index);
    }

}
