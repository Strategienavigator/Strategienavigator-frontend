import {Exporter} from "./Exporter";


class ExcelExporter<D> extends Exporter<D> {

    constructor() {
        super("Excel", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    protected onExport(data: D): BlobPart[] {
        return [];
    }



}

export {
    ExcelExporter
}
