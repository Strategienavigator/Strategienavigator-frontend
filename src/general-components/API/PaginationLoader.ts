import {PaginationResource} from "../Datastructures";
import {CallInterface} from "./API";

/**
 * Klasse welche das Laden der Seiten einer Pagination übernimmt. Die Ergebnisse werden gecached.
 *
 * Man kann der Klasse entweder eine function im Konstruktor übergeben, welche die Daten vom Backend lädt
 * oder man erbt aus der Klasse und überschreibt die {@link loadPage} Funktion
 */
export class PaginationLoader<D extends object> {
    private readonly data: Array<Array<D>>;
    private readonly getPageCallback?: (page: number) => Promise<CallInterface<PaginationResource<D>> | null>;
    private callbackGiven: boolean = false;
    private _pageCount: number = 0;

    constructor(cb?: (page: number) => Promise<CallInterface<PaginationResource<D>> | null>) {
        this.data = [];
        this.callbackGiven = cb !== null && cb !== undefined;

        this.getPageCallback = cb;

    }

    protected async loadPage(page: number): Promise<CallInterface<PaginationResource<D>> | null> {
        return null;
    };

    public async getPage(page: number) {
        if (this.getPageData(page) === null || this.getPageData(page) === undefined) {
            let result = await this.getGetPageCallback()(page);
            if (result === null || result === undefined) {
                if (!this.callbackGiven) {
                    throw new Error("No PageCallback given!");
                }
            } else {
                if (result.success) {
                    let d = result.callData;
                    this.setPageData(d.meta.current_page, d.data);
                    this.pageCount = d.meta.last_page;
                    return this.getPageData(d.meta.current_page);
                }
            }
        } else {
            return this.getPageData(page);
        }
        return null;
    }

    private getGetPageCallback() {
        if (this.callbackGiven) {
            return this.getPageCallback as (page: number) => Promise<CallInterface<PaginationResource<D>> | null>;
        } else {
            return this.loadPage.bind(this);
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
