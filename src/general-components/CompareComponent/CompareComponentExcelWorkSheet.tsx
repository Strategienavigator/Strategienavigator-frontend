import {ExcelExporter} from "../Export/ExcelExporter";
import {CellAddress, CellStyle, Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../Datastructures";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareComponentValues, SingleComparison} from "./CompareComponent";
import {CompareHeaderAdapter} from "./Header/CompareHeaderAdapter";
import {CardComponentFields} from "../CardComponent/CardComponent";
import {UACriteriaCustomDescriptionValues} from "../../components/tools/utility-analysis/steps/UtilCriterias/UACriteriaCustomDescription";
import {WeightingEvaluation} from "../EvaluationComponent/Weighting/WeightingEvaluation";


class CompareComponentExcelWorkSheet extends ExcelExporter<any> {
    private readonly header: CompareHeaderAdapter;
    private readonly adapter: CompareAdapter;
    private readonly values: CompareComponentValues;
    private readonly starterCell: CellAddress = {c: 0, r: 0};
    private readonly activeIndices: number[] = [];

    constructor(adapter: CompareAdapter, values: CompareComponentValues, header: CompareHeaderAdapter, activeIndices?: number[], startCell?: CellAddress) {
        super();
        this.adapter = adapter;
        this.values = values;
        this.header = header;

        if (activeIndices) {
            this.activeIndices = activeIndices;
        } else {
            this.activeIndices = header.getHeaders().map((value, index) => {
                return (index + 1)
            });
        }

        if (startCell) {
            this.starterCell = startCell;
        }
    }

    /**
     * Gibt das Worksheet zurück
     * @returns {WorkSheet}
     */
    public getExcelSheet(): WorkSheet {
        let ws: WorkSheet = {};
        let cell = this.starterCell;

        let disabledStyle: CellStyle = {
            font: {
                color: {
                    rgb: "8f8f8f"
                }
            }
        };
        let comparisons: SingleComparison[] = this.adapter.toArray();

        cell.c = 1;
        // Header
        let h = 1;
        for (const header of this.header.getHeaders()) {
            ws[this.encodeCell(cell)] = {
                v: header.header,
                t: "s",
                s: Object.assign({
                    alignment: {
                        horizontal: "center"
                    }
                }, (this.activeIndices.includes(h)) ? {} : disabledStyle)
            };
            cell.c += 1;
            h++;
        }
        cell.r += 1;

        let comp = 0;
        for (const comparison of comparisons) {
            cell.c = 0;
            ws[this.encodeCell(cell)] = {
                v: comparison.first, t: "s"
            };
            cell.c += 1;

            // Header
            for (const header of this.header.getHeaders()) {
                if (this.values.comparisons[comp].header === header.header) {
                    ws[this.encodeCell(cell)] = {
                        v: "X", t: "s", s: {
                            alignment: {
                                horizontal: "center"
                            }
                        }
                    };
                }
                cell.c += 1;
            }

            if (comparison.second) {
                ws[this.encodeCell(cell)] = {
                    v: comparison.second, t: "s", s: {
                        alignment: {
                            horizontal: "right"
                        }
                    }
                }
            }

            cell.r += 1;
            comp++;
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        return ws;
    }

    public basedOnWeightingCardComponent<D extends object>(values: { fields: CardComponentFields<D>, comparisons: CompareComponentValues[] }, weighting: CompareComponentValues): WorkSheet {
        let evaluation = new WeightingEvaluation(values.fields, weighting).getValues();
        let indices: number[] = [];
        values.fields = values.fields.filter((item, i) => {
            let some = evaluation.result.some((item) => {
                return values.fields[i] === item.criteria && item.points !== 0;
            });

            if (some)
                indices.push(i);

            return some;
        });
        values.comparisons = values.comparisons.filter((item, i) => {
           return indices.includes(i);
        });
        return this.basedOnCardComponent(values);
    }

    public basedOnCardComponent<D extends object>(values: { fields: CardComponentFields<D>, comparisons: CompareComponentValues[] }): WorkSheet {
        let ws: WorkSheet = {};
        let cell = this.starterCell;

        let i = 0;
        for (let field of values.fields) {
            cell.c = 0;

            ws[this.encodeCell(cell)] = {
                v: field.name, t: "s", s: this.getHeaderStyle()
            }
            cell.r += 1;

            let extra = field.extra as UACriteriaCustomDescriptionValues;
            let activeIndices: number[] | undefined = undefined;
            if (extra !== undefined && Object.keys(extra).length > 0) {
                activeIndices = extra.activeIndices;
            }

            ws = Object.assign(ws, new CompareComponentExcelWorkSheet(this.adapter, values.comparisons[i], this.header, activeIndices, cell).getExcelSheet());
            cell.r += 2;

            i++;
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        return ws;
    }

    protected buildExcel(workbook: WorkBook, data: SaveResource<any>): boolean {
        return false;
    }

}

export {
    CompareComponentExcelWorkSheet
}