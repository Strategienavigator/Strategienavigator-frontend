import {CompareHeader} from "./CompareHeader";


class CompareNumberHeader extends CompareHeader {
    private readonly length: number;
    private readonly start: number;

    /**
     * Erstellt eine neue Instanz des CompareHeaders
     * @param length länge des CompareHeaders
     */
    constructor(length: number)
    /**
     * Erstellt eine neue Instanz des CompareHeaders
     * @param start Start Nummer
     * @param length länge des CompareHeaders
     */
    constructor(start: number, length?: number) {
        super();
        this.length = length ? length : start;
        this.start = length ? start : 0;
    }

    /**
     * Erstellt ein Array welche alle Zahlen von start zu start + length - 1 enthält
     */
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
