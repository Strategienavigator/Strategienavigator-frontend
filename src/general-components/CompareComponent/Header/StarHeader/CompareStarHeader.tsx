import {CompareHeader, CompareHeaderAdapter} from "../CompareHeaderAdapter";

import "./star-header.scss";

class CompareStarHeader extends CompareHeaderAdapter {
    private readonly length: number;
    private readonly start: number;

    /**
     * Erstellt eine neue Instanz des CompareStarHeader
     *
     * @param start Start Nummer
     * @param length länge des CompareHeaders
     */
    constructor(start: number, length: number) {
        super("StarHeader");
        this.length = length;
        this.start = start;
    }

    /**
     * Erstellt ein Array welche alle Zahlen von start zu (start + length - 1) enthält
     */
    getHeaders(): Array<CompareHeader> {
        let headers:Array<CompareHeader> = [];
        for (let i = this.start; i < (this.start + this.length); i++) {
            headers.push({header: "★ ".repeat(i), desc :undefined});
        }
        return headers;
    }

}

export {
    CompareStarHeader
}