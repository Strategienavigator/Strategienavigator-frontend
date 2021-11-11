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

    constructor(cb?: (page: number) => Promise<CallInterface<PaginationResource<D>> | null>) {
        this.data = [];
        this.getPageCallback = cb;
    }

    private _pageCount: number = -1;

    public get pageCount(): number {
        return this._pageCount;
    }

    private set pageCount(value: number) {
        this._pageCount = value;
    }

    /**
     * Lädt die angegebene Seite, wenn nicht anders definiert werden die Daten erst versucht aus dem Cache zu laden,
     * nur wenn kein Cache Eintrag vorhanden wird, wird eine Netzwerkabfrage durchgeführt
     * @param page Seite der Pagination
     * @param cached Ob der Cache berücksichtigt werden soll
     */
    public async getPage(page: number,cached: boolean = true) {
        if (this.getPageData(page) === null || this.getPageData(page) === undefined || !cached) {
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

    /**
     * Lädt alle Daten aus dem Backend und potentiel auch aus den Cached und gibt sie als ein Array zurück
     * @param cached ob die Daten auch gechached sein dürfen
     */
    public async getAll(cached:boolean = true) {
        let allData = new Array<D>();
        let result = await this.getPage(1,cached);
        let callbacks = new Array<Promise<D[] | null>>();
        if (result) {
            allData.push(...result);
        }
        for (let i = 2; i <= this.pageCount; i++) {
            callbacks.push(this.getPage(i,cached));
        }

        let results = await Promise.all(callbacks);
        for (let r of results) {
            if (r) {
                allData.concat(r);
            }
        }
        return allData
    }

    private setPageData(page: number, data: D[]) {
        this.data[page] = data;
    }

    private getPageData(page: number) {
        return this.data[page];
    }
}
