import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {PairwiseComparisonValues} from "../PairwiseComparison";
import {SaveResource} from "../../../../general-components/Datastructures";
import {Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {PCPairComparisonValues} from "../steps/PCPairComparison/PCPairComparisonComponent";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "../steps/PCCriterias/PCCriteriasComponent";
import {WeightingEvaluation} from "../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation";
import {WeightingEvaluationExcelWorkSheet} from "../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluationExcelWorkSheet";
import {CardComponentExcelWorkSheet} from "../../../../general-components/CardComponent/CardComponentExcelWorkSheet";


/**
 * Stellt den Excel-Export für den Paarweisen Vergleich dar
 */
class PCExcelExporter extends ExcelExporter<PairwiseComparisonValues> {

    /**
     * Baut die Excel-Datei
     * Fügt insgesamt Zwei Seiten hinzu
     *
     * @param {WorkBook} workbook Die Excel-Datei
     * @param {SaveResource<PairwiseComparisonValues>} data Die Daten des Paarweisen-Vergleichs
     * @returns {boolean} Gibt zurück ob der Aufbau erfolgreich war
     * @protected
     */
    protected buildExcel(workbook: WorkBook, data: SaveResource<PairwiseComparisonValues>): boolean {
        let criterias = data.data["pc-criterias"];
        let comparison = data.data["pc-comparison"];
        let result = data.data["pc-result"];

        if (this.isFilled(criterias)) {
            this.addSheet("Kriterien", new CardComponentExcelWorkSheet(criterias.criterias, "Kriterien").getExcelSheet());

            if (this.isFilled(comparison)) {
                this.addSheet("Vergleich", this.getComparisonSheet(criterias.criterias, comparison));

                if (this.isFilled(result))
                    this.addSheet("Ergebnis", PCExcelExporter.getResultSheet(criterias, comparison));
            }
        }

        return true;
    }

    /**
     * Erstellt die Excel-Seite für den Vergleich
     *
     * @param {CardComponentFields} criterias Die Kriterien vom Paarweisen-Vergleich
     * @param {PCPairComparisonValues} comparison Der Vergleich vom Paarweisen-Vergleich
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getComparisonSheet(criterias: CardComponentFields, comparison: PCPairComparisonValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        // Header
        cell.c = 1;
        let headers = comparison.headers;
        for (let header of headers) {
            ws[this.encodeCell(cell)] = {
                v: header.header, t: "s", s: Object.assign(
                    {
                        alignment: {
                            horizontal: "center"
                        }
                    },
                    this.getHeaderStyle())
            }
            cell.c += 1;
        }

        let adapter = new MatchCardComponentFieldsAdapter(criterias);
        for (let i = 0; i < adapter.getLength(); i++) {
            let field = adapter.getEntry(i);
            cell.c = 0;
            cell.r += 1;

            ws[this.encodeCell(cell)] = {
                v: field.first, t: "s"
            }
            cell.c += 1;

            for (let e = 0; e < headers.length; e++) {
                if (comparison.comparisons[i].header === headers[e].header) {
                    ws[this.encodeCell(cell)] = {
                        v: "X", t: "s", s: Object.assign(
                            {
                                alignment: {
                                    horizontal: "center"
                                }
                            },
                            this.getHeaderStyle())
                    }
                }
                cell.c += 1;
            }

            ws[this.encodeCell(cell)] = {
                v: field.second, t: "s"
            }
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        return ws;
    }

    /**
     * Erstellt die Excel-Seite für den Ergebnisschritt
     *
     * @param {PCCriteriasValues} criterias
     * @param {PCPairComparisonValues} comparisons
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private static getResultSheet(criterias: PCCriteriasValues, comparisons: PCPairComparisonValues) {
        let evaluation = new WeightingEvaluation(criterias.criterias, comparisons);
        return new WeightingEvaluationExcelWorkSheet(evaluation, "Kriterium").getExcelSheet();
    }
}

export {
    PCExcelExporter
}
