import {CompareHeader} from "./CompareHeader";


class CompareSymbolHeader extends CompareHeader {
    private readonly symbols: string[];

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