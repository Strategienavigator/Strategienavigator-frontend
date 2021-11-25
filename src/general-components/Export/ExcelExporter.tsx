import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import XLSX,{WorkBook,Sheet,WorkSheet} from "xlsx";
import React from "react";


abstract class ExcelExporter<D> extends Exporter<D> {
    private sheets: Array<XLSX.Sheet> = new Array<XLSX.Sheet>();

    constructor() {
        super("Excel", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }


    protected onExport(data: SaveResource<D>): BlobPart[] {
        return [];
    }

    protected abstract buildExcel(workbook: WorkBook, data: SaveResource<D>): boolean;

    protected addSheet(name:string){
        // TODO: HTML tabellen umbauen in sheets!
        //  Dann die JSX-Tabelle umbauen als string und diesen mittels XLSX.read einbinden
        //  NOTE: XLSX.read can handle HTML represented as strings
        //  ALSO: XLSX.utils.json_to_sheet(csvData);
    }

}
export {
    ExcelExporter
}
