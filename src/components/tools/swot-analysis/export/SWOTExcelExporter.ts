import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import {SaveResource} from "../../../../general-components/Datastructures";
import XLSX, {CellAddress, CellObject, Range, WorkSheet} from "xlsx-js-style";
import {SwotFactorsValues} from "../steps/SWOTFactors";
import {SWOTAlternativeActionsValues} from "../steps/SWOTAlternativeActions";
import {SWOTClassifyAlternativeActionsValues} from "../steps/SWOTClassifyAlternativeActions/SWOTClassifyAlternativeActions";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";


class SWOTExcelExporter extends ExcelExporter<SWOTAnalysisValues> {

    private encodeCell = XLSX.utils.encode_cell;
    private encodeRange = XLSX.utils.encode_range;

    protected buildExcel(workbook: XLSX.WorkBook, data: SaveResource<SWOTAnalysisValues>): boolean {
        let factors = data.data["swot-factors"];
        let alternatives = data.data["alternative-actions"];
        let classifications = data.data["swot-classify-alternate-actions"];

        const isFilled = (o: object): boolean => {
            return o && Object.keys(o).length > 0;
        }

        if (isFilled(factors))
            this.addSheet("Faktoren", this.getFactorsWorksheet(factors));

        if (isFilled(alternatives))
            this.addSheet("Handlungsalternativen", this.getAlternativesWorksheet(alternatives));

        if (isFilled(classifications))
            this.addSheet("Klassifikationen", this.getClassificationsWorksheet(classifications));

        return true;
    }

    private getAlternativesWorksheet(alternatives: SWOTAlternativeActionsValues) {
        let ws: WorkSheet = {};
        ws["A1"] = {v: "Kombination:", t: "s"} as CellObject;
        ws["B1"] = {v: "Entscheidung 1:", t: "s"} as CellObject;
        ws["C1"] = {v: "Beschreibung 1:", t: "s"} as CellObject;
        ws["D1"] = {v: "Entscheidung 2:", t: "s"} as CellObject;
        ws["E1"] = {v: "Beschreibung 2:", t: "s"} as CellObject;

        // set cell widths
        ws["!cols"] = [
            {
                wch: 30
            },
            {
                wch: 30
            },
            {
                wch: 30
            },
            {
                wch: 30
            },
            {
                wch: 30
            }
        ];

        let i = 2;

        for (const action of alternatives.actions) {

            ws["A" + i] = {v: action.name, t: "s"} as CellObject;
            if (action.hasNone) {
                ws["B" + i] = {v: "/", t: "s"} as CellObject;
                ws["C" + i] = {v: "/", t: "s"} as CellObject;
                ws["D" + i] = {v: "/", t: "s"} as CellObject;
                ws["E" + i] = {v: "/", t: "s"} as CellObject;
            } else {
                ws["B" + i] = {v: action.first ? action.first.name : "/", t: "s"} as CellObject;
                ws["C" + i] = {v: action.first ? action.first.desc : "/", t: "s"} as CellObject;
                ws["D" + i] = {v: action.second ? action.second.name : "/", t: "s"} as CellObject;
                ws["E" + i] = {v: action.second ? action.second.desc : "/", t: "s"} as CellObject;
            }

            i++;
        }
        let range: Range = {s: {r: 0, c: 0}, e: {r: i, c: 5}}

        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getClassificationsWorksheet(classifications: SWOTClassifyAlternativeActionsValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        for (const classification of classifications.classifications) {
            ws[this.encodeCell(cell)] = {
                v: "Klassifikation " + classification.name, t: "s", s: this.getHeaderStyle() && {
                    font: {
                        sz: 13
                    }
                }
            };
            cell.r += 1;

            ws[this.encodeCell(cell)] = {
                v: "Kombination", t: "s", s: this.getHeaderStyle()
            };
            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                v: "Handlungsalternative", t: "s", s: this.getHeaderStyle()
            };
            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                v: "Beschreibung", t: "s", s: this.getHeaderStyle() && {
                    fill: {
                        bgColor: {rgb: "B33F3F3F"}
                    }
                }
            };
            cell.c = 0;
            cell.r += 1;

            for (const action of classification.actions) {
                console.log(action);
                ws[this.encodeCell(cell)] = {v: action.name, t: "s"};
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.name, t: "s"};
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.desc, t: "s"};
                cell.r += 1;
                cell.c = 0;
            }

            cell.r += 2;
        }

        ws["!cols"] = [
            {
                wch: 40
            },
            {
                wch: 40
            },
            {
                wch: 40
            },
            {
                wch: 40
            },
        ];

        cell.c = 4;
        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);
        return ws;
    }

    /**
     * Erstellt das Worksheet für den ersten Schritt der SWOT-Analyse
     * @param {SwotFactorsValues} factors Daten welche benutzt um das Worksheet zu erstellen
     * @returns {WorkSheet} Das erstellte Worksheet
     * @private
     */
    private getFactorsWorksheet(factors: SwotFactorsValues) {
        let ws: WorkSheet = {};
        let range: Range = {s: {r: 0, c: 0}, e: {r: 0, c: 3}}

        let chances = factors.factors.chances;
        let strengths = factors.factors.strengths;
        let risks = factors.factors.risks;
        let weaknesses = factors.factors.weaknesses;

        const cell: CellAddress = {c: 0, r: 0};

        const tablesData = [
            {name: "Stärken", d: strengths},
            {name: "Schwächen", d: weaknesses},
            {name: "Chancen", d: chances},
            {name: "Risiken", d: risks}
        ];
        let nameWidth = 0;

        const updateWidth = (w: number) => {
            if (nameWidth < w) {
                nameWidth = w;
            }
        }
        for (const table of tablesData) {
            ws[this.encodeCell(cell)] = {v: table.name, t: "s", s: this.getHeaderStyle()};
            updateWidth(table.name.length);
            cell.r++;
            ws[this.encodeCell(cell)] = {v: "Name", t: "s", s: this.getHeaderStyle()};
            cell.c++;
            ws[this.encodeCell(cell)] = {v: "Beschreibung", t: "s", s: this.getHeaderStyle()};
            cell.c = 0;
            cell.r++;
            for (const tableElement of table.d as CardComponentFields) {
                ws[this.encodeCell(cell)] = {v: tableElement.name, t: "s"};
                updateWidth(tableElement.name.length);
                cell.c++;
                ws[this.encodeCell(cell)] = {v: tableElement.desc, t: "s"};
                cell.r++;
                cell.c = 0;
            }
            cell.r += 3;
        }

        range.e.r = cell.r;

        ws["!cols"] = [
            {
                wch: nameWidth
            }
        ]

        ws["!ref"] = this.encodeRange(range);
        return ws;
    }

}


export {
    SWOTExcelExporter
}