import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {PairwiseComparisonValues} from "../PairwiseComparison";
import {SaveResource} from "../../../../general-components/Datastructures";
import {Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {PCPairComparisonValues} from "../steps/PCPairComparison/PCPairComparisonComponent";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "../steps/PCCriterias/PCCriteriasComponent";
import {Evaluation} from "../../../../general-components/EvaluationComponent/Evaluation";
import {EvaluationExcelWorkSheet} from "../../../../general-components/EvaluationComponent/EvaluationExcelWorkSheet";


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

        const isFilled = <D extends object>(o?: D): o is D => {
            return o !== undefined && Object.keys(o).length > 0;
        }

        if (isFilled(criterias)) {
            this.addSheet("Kriterien", this.getCriteriaSheet(criterias.criterias));
            if (isFilled(comparison)) {
                this.addSheet("Vergleich", this.getComparisonSheet(criterias.criterias, comparison));
                if (isFilled(result)) {
                    this.addSheet("Ergebnis", this.getResultSheet(criterias, comparison));
                }
            }
        }

        return true;
    }

    /**
     * Erstellt die Excel-Seite für die Kriterien
     *
     * @param {CardComponentFields} criterias Die Kriterien vom Paarweisen-Vergleich
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getCriteriaSheet(criterias: CardComponentFields) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let criteriaLength = 9;
        let descLength = 12;

        // Header
        ws[this.encodeCell(cell)] = {
            v: "Kriterium", t: "s", s: this.getHeaderStyle()
        };
        cell.c = 1;
        ws[this.encodeCell(cell)] = {
            v: "Beschreibung", t: "s", s: this.getHeaderStyle()
        };
        cell.c = 0;

        for (let criteria of criterias) {
            cell.r += 1;
            cell.c = 0;

            ws[this.encodeCell(cell)] = {
                v: criteria.name, t: "s"
            }
            criteriaLength = this.updateWidth(criteriaLength, criteria.name.length);
            cell.c = 1;
            ws[this.encodeCell(cell)] = {
                v: criteria.desc, t: "s"
            }
            descLength = this.updateWidth(descLength, criteria.desc.length);
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        ws["!cols"] = [
            {
                wch: criteriaLength
            },
            {
                wch: descLength
            }
        ];

        return ws;
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
    private getResultSheet(criterias: PCCriteriasValues, comparisons: PCPairComparisonValues) {
        let evaluation = new Evaluation(criterias.criterias, comparisons);
        return new EvaluationExcelWorkSheet(evaluation, "Kriterium").getExcelSheet();
    }
}

export {
    PCExcelExporter
}
