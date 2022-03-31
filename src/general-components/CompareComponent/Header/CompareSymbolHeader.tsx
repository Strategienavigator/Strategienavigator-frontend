import {CompareHeader, CompareHeaderAdapter} from "./CompareHeaderAdapter";


/**
 * Stellt einen Header mittels Symbolen dar.
 * So können auch Header wie "-- - 0 + ++" dargestellt werden.
 */
class CompareSymbolHeader extends CompareHeaderAdapter {
    private readonly symbols: CompareHeader[];

    /**
     * @param {string[]} symbols Array aus symbolen. Müssen in der richtigen Reihenfolge angegeben werden
     */
    constructor(symbols: string[])
    constructor(symbols: CompareHeader[])
    constructor(symbols: CompareHeader[] | string[]) {
        super("SymbolHeader");
        this.symbols = symbols.map<CompareHeader>(s => {
            if ("string" === typeof s) {
                return {header: s};
            } else {
                return s;
            }
        });

    }

    getHeaders(): Array<CompareHeader> {
        return this.symbols;
    }

}

export {
    CompareSymbolHeader
}
