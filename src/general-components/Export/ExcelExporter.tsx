import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import XLSX, {BookType, CellObject, WorkBook, WorkSheet} from "xlsx";
import React from "react";


abstract class ExcelExporter<D> extends Exporter<D> {
    private sheets: Array<XLSX.Sheet> = new Array<XLSX.Sheet>();
    private workbook?: WorkBook;

    constructor() {
        super("Excel", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }


    protected onExport(data: SaveResource<D>): BlobPart[] {
        if (this.workbook) {
            console.log("WARNING: A Workbook does already exists, it seems you are trying to create multiple excel sheets at the same time");
        }
        this.workbook = XLSX.utils.book_new();
        let startPage = this.buildStartPage(this.workbook, data);

        this.buildExcel(this.workbook, data);
        if (this.workbook) {
            let buffer = XLSX.write(this.workbook, {bookType: this.getFileExtension() as BookType, type: "array"})
            return [buffer];
        }
        return []
    }

    protected abstract buildExcel(workbook: WorkBook, data: SaveResource<D>): boolean;

    protected addSheet(name: string) {
        // TODO: HTML tabellen umbauen in sheets!
        //  Dann die JSX-Tabelle umbauen als string und diesen mittels XLSX.read einbinden
        //  NOTE: XLSX.read can handle HTML represented as strings
        //  ALSO: XLSX.utils.json_to_sheet(csvData);
    }

    private buildStartPage(workbook: WorkBook, data: SaveResource<D>): WorkSheet {
        let worksheet: WorkSheet = {};
        // set range of cells which contains data
        let range: XLSX.Range = {s: {c: 0, r: 0}, e: {c: 1, r: 1}};
        worksheet["!ref"] = XLSX.utils.encode_range(range);

        // insert data into the cells
        worksheet["A1"] = {v: "Name:", t: "s"} as CellObject;
        worksheet["B1"] = {v: data.name, t: "s"} as CellObject;
        worksheet["A2"] = {v: "Beschreibung:", t: "s"} as CellObject;
        worksheet["B2"] = {v: data.description, t: "s"} as CellObject;

        XLSX.utils.book_append_sheet(workbook, worksheet, "Grundlagen");
        return worksheet;
    }

}

export {
    ExcelExporter
}
