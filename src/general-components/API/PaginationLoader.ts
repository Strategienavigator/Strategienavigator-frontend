import {PaginationResource} from "../Datastructures";
import {CallInterface} from "./API";


type PageCallback<D> = (page: number, perPage?:number) => Promise<CallInterface<PaginationResource<D>> | null>;

export interface PaginationPage<D> {
    page:number,
    data:Array<D>,
    from:number
}

/**
 * Klasse welche das Laden der Seiten einer Pagination übernimmt. Die Ergebnisse werden gecached.
 *
 * Man muss der Klasse eine function im Konstruktor übergeben, welche die Daten vom Backend lädt
 */
export class PaginationLoader<D extends object> {
    private readonly data: Array<PaginationPage<D>>;
    private readonly getPageCallback?: PageCallback<D>;

    constructor(cb?: PageCallback<D>) {
        this.data = [];
        this.getPageCallback = cb;
    }


    /**
     * Anzahl der Seiten
     * @private
     */
    private _pageCount: number = -1;
    /**
     * Anzahl an Einträgen die insgesamt verfügbar sind
     * @private
     */
    private _totalResults: number = -1;

    /**
     * Anzahl der Einträge die pro Seite angezeigt werden.
     * @private
     */
    private _perPage: number = -1;


    get perPage(): number {
        return this._perPage;
    }

    set perPage(value: number) {
        this._perPage = value;
    }

    get totalResults(): number {
        return this._totalResults;
    }

    private set totalResults(value: number) {
        this._totalResults = value;
    }

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
                let result = await this.getPageCallback(page,this.perPage>0?this.perPage:undefined);
                if (result !== null && result !== undefined) {
                    if (result.success) {
                        let d = result.callData;
                        const paginationPage:PaginationPage<D> = {
                            page:page,
                            from:d.meta.from??0,
                            data:d.data
                        }
                        this.setPageData(d.meta.current_page, paginationPage);
                        this.pageCount = d.meta.last_page;
                        this.perPage = d.meta.per_page;
                        this.totalResults = d.meta.total;

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
     * Lädt alle Daten aus dem Backend und wenn verfügbar auch aus dem Cache und gibt sie als ein Array zurück
     * @param cached ob die Daten auch gechached sein dürfen
     */
    public async getAll(cached:boolean = true) {
        let allData = new Array<D>();
        let result = await this.getPage(1,cached);

        let callbacks = new Array<Promise<PaginationPage<D> | null>>();
        if (result) {
            allData.push(...result.data);
        }
        for (let i = 2; i <= this.pageCount; i++) {
            callbacks.push(this.getPage(i,cached));
        }

        let results = await Promise.all(callbacks);
        for (let r of results) {
            if (r) {
                allData.concat(r.data);
            }
        }
        return allData
    }

    private setPageData(page: number, data: PaginationPage<D>) {
        this.data[page] = data;
    }

    private getPageData(page: number) {
        return this.data[page];
    }
}
