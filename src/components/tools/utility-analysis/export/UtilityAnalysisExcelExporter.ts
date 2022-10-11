import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {UtilityAnalysisValues} from "../UtilityAnalysis";
import XLSX, {Range, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../../../../general-components/Datastructures";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {UACriteriaCustomDescriptionValues} from "../steps/UtilCriterias/UACriteriaCustomDescription";
import {UtilWeightingValues} from "../steps/UtilWeighting/UtilWeightingComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {UtilEvaluationValues} from "../steps/UtilEvaluation/UtilEvaluationComponent";
import {LinearCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/LinearCardComponentFieldsAdapter";
import {UtilResultValues} from "../steps/UtilityResult/UtilResultComponent";
import {CardComponentExcelWorkSheet} from "../../../../general-components/CardComponent/CardComponentExcelWorkSheet";
import {UtilEvaluation} from "../steps/UtilEvaluation/UtilEvaluation";
import {CompareComponentExcelWorkSheet} from "../../../../general-components/CompareComponent/CompareComponentExcelWorkSheet";
import {UtilWeighting} from "../steps/UtilWeighting/UtilWeighting";
import {WeightingEvaluationExcelWorkSheet} from "../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluationExcelWorkSheet";
import {WeightingEvaluation} from "../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation";


/**
 * Excel-Exporter für die Nutzwertanalyse
 */
class UtilityAnalysisExcelExporter extends ExcelExporter<UtilityAnalysisValues> {

    /**
     *
     * @param {CardComponentFields<UACriteriaCustomDescriptionValues>} criterias Kriterien der Nutzwertanalyse
     * @param {CardComponentFields} investigationObjs Untersuchungsobjekte der Nutzwertanalyse
     * @param {UtilEvaluationValues} evaluation Evaluationsdaten aus dem 4. Schritt der Nutzwertanalyse
     * @return {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private static getEvaluationSheet(criterias: CardComponentFields<UACriteriaCustomDescriptionValues>, investigationObjs: CardComponentFields, evaluation: UtilEvaluationValues, weighting: UtilWeightingValues) {
        let adapter = new LinearCardComponentFieldsAdapter(investigationObjs);

        return new CompareComponentExcelWorkSheet(adapter, evaluation.evaluation[0].rating, UtilEvaluation.header).basedOnWeightingCardComponent({
            fields: criterias,
            comparisons: evaluation.evaluation.map((value) => {
                return value.rating;
            })
        }, weighting);
    }

    /**
     * Erstellt die Excel-Seite für die Gewichtung der Kriterien
     *
     * @param {CardComponentFields<UACriteriaCustomDescriptionValues>} criterias Kriterien der Nutzwertanalyse
     * @param {UtilWeightingValues} weighting Gewichtung der Kriterien
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private static getWeightingSheet(criterias: CardComponentFields<UACriteriaCustomDescriptionValues>, weighting: UtilWeightingValues) {
        let adapter = new MatchCardComponentFieldsAdapter(criterias);
        let ws = new CompareComponentExcelWorkSheet(adapter, weighting, UtilWeighting.header).getExcelSheet();
        let lastRow = ExcelExporter.getLastRow(ws) + 2;
        let evaluation = new WeightingEvaluation(criterias, weighting);

        let returnWS = Object.assign(ws, new WeightingEvaluationExcelWorkSheet(evaluation, undefined, {
            c: 0,
            r: lastRow
        }).getExcelSheet());
        returnWS["!ref"] = XLSX.utils.encode_range({s: {r: 0, c: 0}, e: {r: 100, c: 100}});
        return returnWS;
    }

    protected buildExcel(workbook: XLSX.WorkBook, data: SaveResource<UtilityAnalysisValues>): boolean {
        let investigationObjs = data.data["ua-investigation-obj"];
        let criterias = data.data["ua-criterias"];
        let weighting = data.data["ua-weighting"];
        let evaluation = data.data["ua-evaluation"];
        let result = data.data["ua-result"];

        if (this.isFilled(investigationObjs)) {
            this.addSheet("Untersuchungsobjekte", new CardComponentExcelWorkSheet(investigationObjs?.objects, "Untersuchungsobjekt").getExcelSheet());

            if (this.isFilled(criterias)) {
                this.addSheet("Kriterien", new CardComponentExcelWorkSheet(criterias?.criterias, "Kriterium", (extra) => {
                    // TODO: Skalabeschreibung einbauen
                    return [];
                }).getExcelSheet());

                if (this.isFilled(weighting)) {
                    this.addSheet("Gewichtung", UtilityAnalysisExcelExporter.getWeightingSheet(criterias.criterias, weighting));

                    if (this.isFilled(evaluation)) {
                        this.addSheet("Bewertung", UtilityAnalysisExcelExporter.getEvaluationSheet(criterias.criterias, investigationObjs.objects, evaluation, weighting));

                        if (this.isFilled(result)) {
                            this.addSheet("Ergebnis", this.getResultSheet(result));
                        }
                    }
                }
            }
        }

        return false;
    }

    private getResultSheet(values: UtilResultValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let objectLength = "Objekt".length;

        ws[this.encodeCell(cell)] = {
            t: "s", v: "Objekt", s: this.getHeaderStyle()
        }

        cell.c += 1;

        ws[this.encodeCell(cell)] = {
            t: "s", v: "Punkte", s: this.getHeaderStyle()
        }

        cell.c += 1;

        ws[this.encodeCell(cell)] = {
            t: "s", v: "Rang", s: this.getHeaderStyle()
        }

        for (const value of values.result) {
            cell.c = 0;
            cell.r += 1;

            ws[this.encodeCell(cell)] = {
                v: value.object.name, t: "s"
            };
            objectLength = this.updateWidth(objectLength, value.object.name.length);

            cell.c += 1;

            ws[this.encodeCell(cell)] = {
                v: value.points, t: "s"
            };

            cell.c += 1;

            ws[this.encodeCell(cell)] = {
                v: value.rank, t: "s"
            };
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        ws["!cols"] = [
            {
                wch: objectLength
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
}

export {
    UtilityAnalysisExcelExporter
}
