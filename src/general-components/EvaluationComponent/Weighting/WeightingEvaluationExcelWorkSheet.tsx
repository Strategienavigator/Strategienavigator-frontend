import {CellAddress, Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {ExcelExporter} from "../../Export/ExcelExporter";
import {SaveResource} from "../../Datastructures";
import {EvaluationValues, WeightingEvaluation} from "./WeightingEvaluation";


/**
 * Wandelt die instanz der Evaluation in ein Excel-Worksheet um, sodass dies bei den Exporten leicht eingebunden werden kann.
 */
class WeightingEvaluationExcelWorkSheet extends ExcelExporter<any> {
    private values: EvaluationValues;
    private readonly customTableHeader?: string;
    private readonly starterCell: CellAddress = {r: 0, c: 0};

    constructor(evaluation: WeightingEvaluation, customTableHeader?: string, starterCell?: CellAddress) {
        super();
        this.values = evaluation.getValues();
        this.customTableHeader = customTableHeader;

        if (starterCell) {
            this.starterCell = starterCell;
        }
    }

    /**
     * Gibt das Worksheet zurück
     * @returns {WorkSheet}
     */
    public getExcelSheet(): WorkSheet {
        let ws: WorkSheet = {};
        let sum = this.values.result.reduce((p, n) => p + n.points, 0);
        let cell = this.starterCell;

        ws[this.encodeCell(cell)] = {
            t: "s", v: "Ergebnis", s: this.getHeaderStyle()
        }
        cell.r += 1;
        ws[this.encodeCell(cell)] = {
            t: "s", v: this.values.resultAsString
        }
        cell.r += 2;

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
            t: "", v: "Gewichtungsverteilung", s: this.getHeaderStyle()
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
                t: "n", v: (Math.round(((element.points / sum) * 100) * 100) / 100)
            }
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
                wch: "Gewichtungsverteilung".length
            },
            {
                wch: "Punkte".length
            },
            {
                wch: "Rang".length
            }
        ];

        return ws;
    }

    protected buildExcel(workbook: WorkBook, data: SaveResource<any>): boolean {
        return false;
    }

}

export {
    WeightingEvaluationExcelWorkSheet
}
