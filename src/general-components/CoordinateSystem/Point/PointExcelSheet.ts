import {ExcelExporter} from "../../Export/ExcelExporter";
import {CellAddress, WorkBook, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../../Datastructures";
import {Point} from "./Point";


class PointExcelSheet extends ExcelExporter<any> {
    private readonly points: Point[];
    private readonly starterCell: CellAddress = {c: 0, r: 0};
    private readonly customHeader: string = "Punkt";

    constructor(points: Point[], customHeader?: string, starterCell?: CellAddress) {
        super();
        this.points = points;

        if (customHeader)
            this.customHeader = customHeader;
        if (starterCell)
            this.starterCell = starterCell;
    }

    /**
     * Gibt das Worksheet zurück
     * @returns {WorkSheet}
     */
    public getExcelSheet(): WorkSheet {
        let ws: WorkSheet = {};
        let cell: CellAddress = this.starterCell;

        ws[this.encodeCell(cell)] = {
            t: "s", v: "Koordinaten", s: this.getHeaderStyle()
        }
        cell.r += 1;

        // Header
        ws[this.encodeCell(cell)] = {
            t: "s", v: this.customHeader, s: this.getHeaderStyle()
        }
        cell.c += 1;
        // X
        ws[this.encodeCell(cell)] = {
            t: "s", v: "X", s: this.getHeaderStyle()
        }
        cell.c += 1;
        // Y
        ws[this.encodeCell(cell)] = {
            t: "s", v: "Y", s: this.getHeaderStyle()
        }
        cell.r += 1;

        for (const point of this.points) {
            cell.c = 0;

            // Header
            ws[this.encodeCell(cell)] = {
                t: "s", v: point.header
            }
            cell.c += 1;

            // X
            ws[this.encodeCell(cell)] = {
                t: "n", v: point.x
            }
            cell.c += 1;

            // Y
            ws[this.encodeCell(cell)] = {
                t: "n", v: point.y
            }
            cell.c += 1;
            cell.r += 1;
        }

        ws["!ref"] = this.encodeRange({s: {c: 0, r: 0}, e: cell});

        return ws;
    }

    protected buildExcel(workbook: WorkBook, data: SaveResource<any>): boolean {
        return false;
    }

}

export {
    PointExcelSheet
}