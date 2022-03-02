import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import XLSX, {BookType, CellObject, CellStyle, WorkBook, WorkSheet} from "xlsx-js-style";


abstract class ExcelExporter<D> extends Exporter<D> {
    private workbook: WorkBook;
    protected encodeCell = XLSX.utils.encode_cell;
    protected encodeRange = XLSX.utils.encode_range;

    constructor() {
        super("Excel", "xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        this.workbook = XLSX.utils.book_new();
    }

    protected onExport(data: SaveResource<D>): BlobPart[] {
        // create new workbook
        this.workbook = XLSX.utils.book_new();

        this.buildStartPage(this.workbook, data);
        this.buildExcel(this.workbook, data);

        let buffer = XLSX.write(this.workbook, {
            bookType: this.getFileExtension() as BookType,
            type: "array",
            Props: {
                Title: data.name,
                Author: "Strategietools",
            },
            cellStyles: true,
        });
        return [buffer];
    }

    protected updateWidth = (variable: number, w: number) => {
        if (variable < w) {
            return w;
        }
        return variable;
    }

    protected abstract buildExcel(workbook: WorkBook, data: SaveResource<D>): boolean;

    protected addSheet(name: string, worksheet: WorkSheet) {
        XLSX.utils.book_append_sheet(this.workbook, worksheet, name);
    }

    private buildStartPage(workbook: WorkBook, data: SaveResource<D>): void {
        let worksheet: WorkSheet = {};
        // set range of cells which contains data
        worksheet["!ref"] = "A1:B6";

        // set cell widths
        worksheet["!cols"] =  [
            {
                wch: 21
            },
            {
                wch: 19
            }
        ];


        let headerStyle = this.getHeaderStyle();
        // insert data into the cells
        worksheet["A1"] = {v: "Name:", t: "s", s: headerStyle} as CellObject;
        worksheet["B1"] = {v: data.name, t: "s"} as CellObject;

        worksheet["A2"] = {v: "Beschreibung:", t: "s", s: headerStyle} as CellObject;
        worksheet["B2"] = {v: data.description, t: "s"} as CellObject;

        worksheet["A3"] = {v: "Besitzer:", t: "s", s: headerStyle} as CellObject;
        worksheet["B3"] = {v: data.owner, t: "s"} as CellObject;

        worksheet["A5"] = {v: "Erstellt am:", t: "s", s: headerStyle} as CellObject;
        worksheet["B5"] = {v: new Date(data.created_at), t: "d", z: "dd.MM.yyyy hh:mm"} as CellObject;

        worksheet["A6"] = {v: "Zuletzt bearbeitet am:", t: "s", s: headerStyle} as CellObject;
        worksheet["B6"] = {v: new Date(data.updated_at), t: "d", z: "dd.MM.yyyy hh:mm"} as CellObject;

        this.addSheet("Grundlagen", worksheet);
    }

    protected getHeaderStyle(): CellStyle {
        return {
            font: {
                bold: true
            }
        };
    }

}

export {
    ExcelExporter
}
