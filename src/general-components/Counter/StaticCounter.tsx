import {CounterInterface} from "./CounterInterface";


export class StaticCounter implements CounterInterface {

    private readonly count: string;

    constructor(id: string) {
        this.count = id;
    }

    get(index: number): string | null {
        return this.count;
    }

}
