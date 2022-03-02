import {Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {ExcelExporter} from "../Export/ExcelExporter";
import {SaveResource} from "../Datastructures";
import {Evaluation, EvaluationValues} from "./Evaluation";


/**
 * Wandelt die instanz der Evaluation in ein Excel-Worksheet um, sodass dies bei den Exporten leicht eingebunden werden kann.
 */
class EvaluationExcelWorkSheet extends ExcelExporter<any> {
    private values: EvaluationValues;
    private readonly customTableHeader?: string;

    constructor(evaluation: Evaluation, customTableHeader?: string) {
        super();
        this.values = evaluation.getValues();
        this.customTableHeader = customTableHeader;
    }

    /**
     * Gibt das Worksheet zurück
     * @returns {WorkSheet}
     */
    public getExcelSheet(): WorkSheet {
        let ws: WorkSheet = {};

        ws["A1"] = {
            t: "s", v: "Ergebnis", s: this.getHeaderStyle()
        }
        ws["A2"] = {
            t: "s", v: this.values.resultAsString
        }

        let cell = {r: 3, c: 0};

        let criteriaLength = "Feld".length;
        if (this.customTableHeader) {
            criteriaLength = this.customTableHeader.length;
        }

        // header
        ws[this.encodeCell(cell)] = {
            t: "s", v: this.customTableHeader ? this.customTableHeader : "Feld", s: this.getHeaderStyle()
        }
        cell.c += 1;
        ws[this.encodeCell(cell)] = {
            t: "s", v: "Punkte", s: this.getHeaderStyle()
        }
        cell.c += 1;
        ws[this.encodeCell(cell)] = {
            t: "s", v: "Rang", s: this.getHeaderStyle()
        }

        for (const element of this.values.result) {
            cell.c = 0;
            cell.r += 1;

            ws[this.encodeCell(cell)] = {
                t: "s", v: element.criteria.name
            }
            criteriaLength = this.updateWidth(criteriaLength, element.criteria.name.length);

            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                t: "n", v: element.points
            }
            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                t: "n", v: element.rank
            }
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        ws["!cols"] = [
            {
                wch: criteriaLength + 1
            },
            {
                wch: "Punkte".length + 1
            },
            {
                wch: "Rang".length + 1
            }
        ];

        return ws;
    }

    protected buildExcel(workbook: WorkBook, data: SaveResource<any>): boolean {
        return false;
    }

}

export {
    EvaluationExcelWorkSheet
}
