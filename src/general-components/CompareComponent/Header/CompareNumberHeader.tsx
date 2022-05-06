import {CompareHeader, CompareHeaderAdapter} from "./CompareHeaderAdapter";


/**
 * Stellt eine/n Überschrift/Header mittels
 */
class CompareNumberHeader extends CompareHeaderAdapter {
    private readonly length: number;
    private readonly start: number;

    /**
     * Erstellt eine neue Instanz des CompareHeaders
     * @param start Start Nummer
     * @param length länge des CompareHeaders
     */
    constructor(start: number, length: number) {
        super("NumberHeader");
        this.length = length;
        this.start = start;
    }

    /**
     * Erstellt ein Array welche alle Zahlen von start zu (start + length - 1) enthält
     */
    getHeaders(): Array<CompareHeader> {
        let headers: Array<CompareHeader> = [];
        for (let i = this.start; i < (this.start + this.length); i++) {
            headers.push({header: String(i), desc: undefined});
        }
        return headers;
    }

}

export {
    CompareNumberHeader
}
