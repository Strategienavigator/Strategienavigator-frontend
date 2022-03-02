import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {UtilityAnalysisValues} from "../UtilityAnalysis";
import XLSX, {Range, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../../../../general-components/Datastructures";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {UACriteriaCustomDescriptionValues} from "../steps/UtilCriterias/UACriteriaCustomDescription";
import {UtilWeightingValues} from "../steps/UtilWeighting/UtilWeightingComponent";
import {CompareNumberHeader} from "../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {UtilEvaluationValues} from "../steps/UtilEvaluation/UtilEvaluationComponent";
import {CompareSymbolHeader} from "../../../../general-components/CompareComponent/Header/CompareSymbolHeader";
import {LinearCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/LinearCardComponentFieldsAdapter";


/**
 * Excel-Exporter für die Nutzwertanalyse
 */
class UtilityAnalysisExcelExporter extends ExcelExporter<UtilityAnalysisValues> {

    protected buildExcel(workbook: XLSX.WorkBook, data: SaveResource<UtilityAnalysisValues>): boolean {
        let investigationObjs = data.data["ua-investigation-obj"];
        let criterias = data.data["ua-criterias"];
        let weighting = data.data["ua-weighting"];
        let evaluation = data.data["ua-evaluation"];


        const isFilled = <D extends object>(o?: D): o is D => {
            return o !== undefined && Object.keys(o).length > 0;
        }

        if(isFilled(investigationObjs)) {
            this.addSheet("Untersuchungsobjekte", this.getInvestigationObjectSheet(investigationObjs.objects));

            if(isFilled(criterias)) {
                this.addSheet("Kriterien", this.getCriteriaSheet(criterias.criterias));
                if(isFilled(weighting)) {
                    this.addSheet("Gewichtung der Kriterien", this.getWeightingSheet(criterias.criterias, weighting));
                    if(isFilled(evaluation)) {
                        this.addSheet("Evaluation", this.getEvaluationSheet(criterias.criterias, investigationObjs.objects, evaluation));
                    }
                }
            }
        }

        return false;
    }

    /**
     * Erstellt die Excel-Seite für die Untersuchungsobjekte
     *
     * @param {CardComponentFields} investigationObjs Die Untersuchungsobjekte der Nutzwertanalyse
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getInvestigationObjectSheet(investigationObjs: CardComponentFields) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let objLength = 9;
        let descLength = 12;

        // Header
        ws[this.encodeCell(cell)] = {
            v: "Untersuchungsobjekt", t: "s", s: this.getHeaderStyle()
        };
        cell.c = 1;
        ws[this.encodeCell(cell)] = {
            v: "Beschreibung", t: "s", s: this.getHeaderStyle()
        };
        cell.c = 0;

        for(let obj of investigationObjs) {
            cell.r += 1;
            cell.c = 0;

            ws[this.encodeCell(cell)] = {
                v: obj.name, t: "s"
            }
            objLength = this.updateWidth(objLength, obj.name.length);
            cell.c = 1;
            ws[this.encodeCell(cell)] = {
                v: obj.desc, t: "s"
            }
            descLength = this.updateWidth(descLength, obj.desc.length);
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        ws["!cols"] = [
            {
                wch: objLength
            },
            {
                wch: descLength
            }
        ];
        return ws;
    }


    /**
     * Erstellt die Excel-Seite für die Kriterien
     *
     * @param {CardComponentFields<UACriteriaCustomDescriptionValues>} criterias Die Kriterien der Nutzwertanalyse
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getCriteriaSheet(criterias: CardComponentFields<UACriteriaCustomDescriptionValues>) {
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

        // TODO Beschreibung der Skala einbauen
        for(let obj of criterias) {
            cell.r += 1;
            cell.c = 0;

            ws[this.encodeCell(cell)] = {
                v: obj.name, t: "s"
            }
            criteriaLength = this.updateWidth(criteriaLength, obj.name.length);
            cell.c = 1;
            ws[this.encodeCell(cell)] = {
                v: obj.desc, t: "s"
            }
            descLength = this.updateWidth(descLength, obj.desc.length);
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
     * Erstellt die Excel-Seite für die Gewichtung der Kriterien
     *
     * @param {CardComponentFields<UACriteriaCustomDescriptionValues>} criterias Kriterien der Nutzwertanalyse
     * @param {UtilWeightingValues} weighting Gewichtung der Kriterien
     * @returns {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getWeightingSheet(criterias: CardComponentFields<UACriteriaCustomDescriptionValues>, weighting: UtilWeightingValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        // Header
        cell.c = 1;
        let numberHeader = new CompareNumberHeader(0,3);
        let headers = numberHeader.getHeaders();

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

            for (let j = 0; j < headers.length; j++) {
                if(j.toString() === weighting.comparisons[i].header) {
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
     *
     * @param {CardComponentFields<UACriteriaCustomDescriptionValues>} criterias Kriterien der Nutzwertanalyse
     * @param {CardComponentFields} investigationObjs Untersuchungsobjekte der Nutzwertanalyse
     * @param {UtilEvaluationValues} evaluation Evaluationsdaten aus dem 4. Schritt der Nutzwertanalyse
     * @return {WorkSheet} Die erstellte Excel-Seite
     * @private
     */
    private getEvaluationSheet(criterias: CardComponentFields<UACriteriaCustomDescriptionValues>, investigationObjs: CardComponentFields, evaluation: UtilEvaluationValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let symbolHeader = new CompareSymbolHeader(["--","-","0","+","++"]);
        let headers = symbolHeader.getHeaders();

        let adapter = new LinearCardComponentFieldsAdapter(investigationObjs);

        for(let i = 0; i < evaluation.evaluation.length; i++) {
            ws[this.encodeCell(cell)] = {
                v: criterias[i].name, t: "s", s: Object.assign(
                    {
                        alignment: {
                            horizontal: "center"
                        }
                    },
                    this.getHeaderStyle())
            }
            cell.r += 1;
            cell.c = 1;
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
            cell.r += 1;
            cell.c = 0;

            for (let j = 0; j < adapter.getLength(); j++) {
                ws[this.encodeCell(cell)] = {
                    v: adapter.getEntry(j).first, t: "s"
                }
                cell.c = 1;
                for(let e = 0; e < headers.length; e++) {
                    if(evaluation.evaluation[i].rating.comparisons[j].header === headers[e].header) {
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
                cell.r += 1;
                cell.c = 0;
            }
            cell.r += 1;
        }

        cell.c = headers.length;
        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        return ws;
    }

}

export {
    UtilityAnalysisExcelExporter
}
