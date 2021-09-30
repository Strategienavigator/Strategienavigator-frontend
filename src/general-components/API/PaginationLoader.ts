import {PaginationResource} from "../Datastructures";
import {CallInterface} from "./API";

/**
 * Klasse welche das Laden der Seiten einer Pagination übernimmt. Die Ergebnisse werden gecached.
 *
 * Man muss der Klasse eine function im Konstruktor übergeben, welche die Daten vom Backend lädt
 */
export class PaginationLoader<D extends object> {
    private readonly data: Array<Array<D>>;
    private readonly getPageCallback?: (page: number) => Promise<CallInterface<PaginationResource<D>> | null>;
    private _pageCount: number = 0;

    constructor(cb?: (page: number) => Promise<CallInterface<PaginationResource<D>> | null>) {
        this.data = [];
        this.getPageCallback = cb;
    }

    public async getPage(page: number) {
        if (this.getPageData(page) === null || this.getPageData(page) === undefined) {
            if (this.getPageCallback) {
                let result = await this.getPageCallback(page);
                if (result !== null && result !== undefined) {
                    if (result.success) {
                        let d = result.callData;
                        this.setPageData(d.meta.current_page, d.data);
                        this.pageCount = d.meta.last_page;
                        return this.getPageData(d.meta.current_page);
                    }
                }
            } else {
                throw new Error("No PageCallback given!");
            }

        } else {
            return this.getPageData(page);
        }
        return null;
    }


    public get pageCount(): number {
        return this._pageCount;
    }

    private set pageCount(value: number) {
        this._pageCount = value;
    }

    private setPageData(page: number, data: D[]) {
        this.data[page] = data;
    }

    private getPageData(page: number) {
        return this.data[page];
    }
}
