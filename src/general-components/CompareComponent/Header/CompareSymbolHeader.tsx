import {CompareHeader} from "./CompareHeader";


/**
 * Stellt einen Header mittels Symbolen dar.
 * So können auch Header wie "-- - 0 + ++" dargestellt werden.
 */
class CompareSymbolHeader extends CompareHeader {
    private readonly symbols: string[];

    /**
     * @param {string[]} symbols Array aus symbolen. Müssen in der richtigen Reihenfolge angegeben werden
     */
    constructor(symbols: string[]) {
        super();
        this.symbols = symbols;
    }

    getHeaders(): Array<string> {
        return this.symbols;
    }

}

export {
    CompareSymbolHeader
}