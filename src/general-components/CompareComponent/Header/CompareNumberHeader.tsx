import {CompareHeader} from "./CompareHeader";


class CompareNumberHeader extends CompareHeader {
    private readonly length: number;
    private readonly start: number;

    constructor(length: number)
    constructor(start: number, length?: number) {
        super();
        this.length = length ? length : start;
        this.start = length ? start : 0;
    }

    getHeaders(): Array<string> {
        let headers = [];
        for (let i = this.start; i < this.start + this.length; i++) {
            headers.push(String(i));
        }
        return headers;
    }

}

export {
    CompareNumberHeader
}