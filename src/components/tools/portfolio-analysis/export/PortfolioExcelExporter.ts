import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {PortfolioAnalysisValues} from "../PortfolioAnalysis";
import {WorkBook} from "xlsx-js-style";
import {SaveResource} from "../../../../general-components/Datastructures";
import {CardComponentExcelWorkSheet} from "../../../../general-components/CardComponent/CardComponentExcelWorkSheet";
import {CompareComponentExcelWorkSheet} from "../../../../general-components/CompareComponent/CompareComponentExcelWorkSheet";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PortWeighting} from "../steps/PortWeighting/PortWeighting";
import {LinearCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/LinearCardComponentFieldsAdapter";
import {PortEvaluation} from "../steps/PortEvaluation/PortEvaluation";


class PortfolioExcelExporter extends ExcelExporter<PortfolioAnalysisValues> {

    protected buildExcel(workbook: WorkBook, data: SaveResource<PortfolioAnalysisValues>): boolean {
        let objects = data.data["port-objects"];
        let criterias = data.data["port-criterias"];
        let weighting = data.data["port-weighting"];
        let evaluation = data.data["port-evaluation"];

        // 1. Objekte
        if (this.isFilled(objects)) {
            this.addSheet("Objekte", new CardComponentExcelWorkSheet(objects.objects, "Objekt", (cell) => {
                return [
                    {
                        header: "Qualitative Begründung",
                        object: {
                            v: cell.quality, t: "s"
                        }
                    },
                    {
                        header: "Quantitative Begründung",
                        object: {
                            v: cell.quantity, t: "s"
                        }
                    },
                ];
            }).getExcelSheet());
        }

        // 2. Kriterien
        if (this.isFilled(criterias)) {
            let ws = new CardComponentExcelWorkSheet(criterias?.attractivity, "Kriterium", undefined, {
                c: 0,
                r: 1
            }).getExcelSheet();
            ws["A1"] = {
                v: "Marktattraktivität", t: "s", s: this.getHeaderStyle()
            };

            let lastRow = ExcelExporter.getLastRow(ws) + 2;
            ws[this.encodeCell({c: 0, r: lastRow})] = {
                v: "Wettbewerbsposition", t: "s", s: this.getHeaderStyle()
            };

            this.addSheet("Kriterien", Object.assign(ws, new CardComponentExcelWorkSheet(criterias?.["comp-standing"], "Kriterium", undefined, {
                c: 0,
                r: (lastRow + 1)
            }).getExcelSheet()));
        }

        // 3. Gewichtung
        if (this.isFilled(criterias) && this.isFilled(weighting)) {
            let ws = new CompareComponentExcelWorkSheet(new MatchCardComponentFieldsAdapter(criterias?.attractivity), weighting?.attractivity, PortWeighting.header, undefined, {
                c: 0,
                r: 1
            }).getExcelSheet();
            ws["A1"] = {
                v: "Marktattraktivität", t: "s", s: this.getHeaderStyle()
            };
            let lastRow = ExcelExporter.getLastRow(ws) + 2;
            ws[this.encodeCell({c: 0, r: lastRow})] = {
                v: "Wettbewerbsposition", t: "s", s: this.getHeaderStyle()
            };

            this.addSheet("Gewichtung", Object.assign(ws, new CompareComponentExcelWorkSheet(new MatchCardComponentFieldsAdapter(criterias?.["comp-standing"]), weighting?.["comp-standing"], PortWeighting.header, undefined, {
                c: 0,
                r: lastRow + 1
            }).getExcelSheet()));
        }

        // 4. Bewertung
        if (this.isFilled(objects) && this.isFilled(criterias) && this.isFilled(evaluation)) {
            let adapter = new LinearCardComponentFieldsAdapter(objects?.objects);
            let ws = new CompareComponentExcelWorkSheet(adapter, evaluation?.attractivity[0], PortEvaluation.header, undefined, {
                c: 0,
                r: 1
            }).basedOnCardComponent({
                fields: criterias?.attractivity,
                comparisons: evaluation?.attractivity
            });
            ws["A1"] = {
                v: "Marktattraktivität", t: "s", s: this.getHeaderStyle()
            };
            let lastRow = ExcelExporter.getLastRow(ws) + 2;
            ws[this.encodeCell({c: 0, r: lastRow})] = {
                v: "Wettbewerbsposition", t: "s", s: this.getHeaderStyle()
            };

            this.addSheet("Bewertung", Object.assign(ws, new CompareComponentExcelWorkSheet(adapter, evaluation?.["comp-standing"][0], PortEvaluation.header, undefined, {
                c: 0,
                r: lastRow + 1
            }).basedOnCardComponent({
                fields: criterias?.["comp-standing"],
                comparisons: evaluation?.["comp-standing"]
            })));
        }

        return true;
    }

}

export {
    PortfolioExcelExporter
}