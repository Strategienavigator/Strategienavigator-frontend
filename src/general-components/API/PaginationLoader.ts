import {PaginationResource} from "../Datastructures";
import {CallInterface} from "./API";

/**
 * Klasse welche das Laden der Seiten einer Pagination übernimmt. Die Ergebnisse werden gecached.
 *
 * Man kann der Klasse entweder eine function im Konstruktor übergeben, welche die Daten vom Backend lädt
 * oder man erbt aus der Klasse und überschreibt die {@link getPage} Funktion
 */
export class PaginationLoader<D extends object> {
    private readonly data: Array<Array<D>>;
    private readonly getPageCallback?: (page: number) => Promise<CallInterface<PaginationResource<D>>>;
    private _pageCount: number = 0;

    constructor(cb?: (page: number) => Promise<CallInterface<PaginationResource<D>>>) {
        this.data = [];
        this.getPageCallback = cb;
    }

    protected async getPage(page: number): Promise<CallInterface<PaginationResource<D>> | undefined> {
        return undefined;
    };

    public async getData(page: number) {
        if (this.getPageData(page) === null || this.getPageData(page) === undefined) {
            let result = await this.getGetPageCallback()(page);
            if (result === null || result === undefined) {
                throw new Error("No PageCallback given!");
            } else {
                if (result.success) {
                    let d = result.callData;
                    if (result.callData.data.length > 0) {
                        this.setPageData(d.meta.current_page, d.data);
                        this.pageCount = d.meta.last_page;
                    }
                    return this.getPageData(d.meta.current_page);
                }
            }
        } else {
            return this.getPageData(page);
        }
    }

    private getGetPageCallback() {
        if (this.getPageCallback !== null && this.getPageCallback !== undefined) {
            return this.getPageCallback;
        } else {
            return this.getPage.bind(this);
        }
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
