import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";


abstract class ExcelExporter<D> extends Exporter<D> {

    constructor() {
        super("Excel", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }


    protected onExport(data: SaveResource<D>): BlobPart[] {
        return [];
    }

    protected abstract buildExcel(data: SaveResource<D>): object;

}
export {
    ExcelExporter
}
