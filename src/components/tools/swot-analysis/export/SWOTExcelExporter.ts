import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import {SaveResource} from "../../../../general-components/Datastructures";
import XLSX, {CellAddress, CellObject, Range, WorkSheet} from "xlsx-js-style";
import {SwotFactorsValues} from "../steps/SWOTFactors/SWOTFactorsComponent";
import {SWOTAlternativeActionsValues} from "../steps/SWOTAlternativeActions/SWOTAlternativeActionsComponent";
import {
    SWOTClassifyAlternativeActionsValues
} from "../steps/SWOTClassifyAlternativeActions/SWOTClassifyAlternativeActionsComponent";
import {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";


class SWOTExcelExporter extends ExcelExporter<SWOTAnalysisValues> {

    protected buildExcel(workbook: XLSX.WorkBook, data: SaveResource<SWOTAnalysisValues>): boolean {
        let factors = data.data["swot-factors"]!;
        let alternatives = data.data["alternative-actions"]!;
        let classifications = data.data["swot-classify-alternate-actions"]!;

        if (this.isFilled(factors))
            this.addSheet("Faktoren", this.getFactorsWorksheet(factors));

        if (this.isFilled(alternatives))
            this.addSheet("Handlungsalternativen", this.getAlternativesWorksheet(alternatives));

        if (this.isFilled(classifications))
            this.addSheet("Klassifikationen", this.getClassificationsWorksheet(classifications));

        return true;
    }

    private getAlternativesWorksheet(alternatives: SWOTAlternativeActionsValues) {
        let ws: WorkSheet = {};

        let nameWidth1 = 0;
        let descWidth1 = 0;
        let nameWidth2, descWidth2;

        ws["A1"] = {v: "Kombination", t: "s", s: this.getHeaderStyle()} as CellObject;

        ws["B1"] = {v: "Entscheidung 1", t: "s", s: this.getHeaderStyle()} as CellObject;
        nameWidth1 = this.updateWidth(nameWidth1, "Entscheidung 1".length);
        ws["C1"] = {v: "Beschreibung 1", t: "s", s: this.getHeaderStyle()} as CellObject;
        descWidth1 = this.updateWidth(descWidth1, "Beschreibung 1".length);

        ws["D1"] = {v: "Entscheidung 2", t: "s", s: this.getHeaderStyle()} as CellObject;
        ws["E1"] = {v: "Beschreibung 2", t: "s", s: this.getHeaderStyle()} as CellObject;

        nameWidth2 = nameWidth1;
        descWidth2 = descWidth1;

        let i = 2;
        for (const action of alternatives.actions) {

            ws["A" + i] = {v: action.name, t: "s"} as CellObject;
            if (action.hasNone) {
                ws["B" + i] = {v: "", t: "s"} as CellObject;
                ws["C" + i] = {v: "", t: "s"} as CellObject;
                ws["D" + i] = {v: "", t: "s"} as CellObject;
                ws["E" + i] = {v: "", t: "s"} as CellObject;
            } else {
                if (action.alternatives.length > 0) {
                    ws["B" + i] = {v: action.alternatives[0].name, t: "s"} as CellObject;
                    nameWidth1 = this.updateWidth(nameWidth1, action.alternatives[0].name.length);
                    ws["C" + i] = {v: action.alternatives[0].desc, t: "s"} as CellObject;
                    descWidth1 = this.updateWidth(descWidth1, action.alternatives[0].desc.length);

                }

                if (action.alternatives.length > 1) {
                    ws["D" + i] = {v: action.alternatives[1].name, t: "s"} as CellObject;
                    nameWidth2 = this.updateWidth(nameWidth2, action.alternatives[1].name.length);
                    ws["E" + i] = {v: action.alternatives[1].desc, t: "s"} as CellObject;
                    descWidth2 = this.updateWidth(descWidth2, action.alternatives[1].desc.length);
                }
            }
            i++;
        }

        // set cell widths
        ws["!cols"] = [
            {
                wch: 11
            },
            {
                wch: nameWidth1
            },
            {
                wch: descWidth1
            },
            {
                wch: nameWidth2
            },
            {
                wch: descWidth2
            }
        ];

        let range: Range = {s: {r: 0, c: 0}, e: {r: i, c: 5}}

        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getClassificationsWorksheet(classifications: SWOTClassifyAlternativeActionsValues) {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let alternativeWidth = 0;
        let descWidth = 0;

        for (const classification of classifications.classifications) {
            ws[this.encodeCell(cell)] = {
                v: "Klassifikation | " + classification.name, t: "s", s: this.getHeaderStyle()
            };
            cell.r += 1;

            ws[this.encodeCell(cell)] = {
                v: "Kombination", t: "s", s: this.getHeaderStyle()
            };
            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                v: "Handlungsalternative", t: "s", s: this.getHeaderStyle()
            };
            alternativeWidth = this.updateWidth(alternativeWidth, "Handlungsalternative".length);
            cell.c += 1;
            ws[this.encodeCell(cell)] = {
                v: "Beschreibung", t: "s", s: this.getHeaderStyle()
            };
            descWidth = this.updateWidth(descWidth, "Beschreibung".length);
            cell.c = 0;
            cell.r += 1;

            for (const action of classification.actions) {
                ws[this.encodeCell(cell)] = {v: action.name, t: "s"};
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.name, t: "s"};
                alternativeWidth = this.updateWidth(alternativeWidth, action.action.name.length);
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.desc, t: "s"};
                descWidth = this.updateWidth(descWidth, action.action.desc.length);
                cell.r += 1;
                cell.c = 0;
            }

            cell.r += 2;
        }

        ws[this.encodeCell(cell)] = {
            v: "Keine Klassifikation (" +
                classifications.actions.filter((value => {
                    return !value.alreadyAdded;
                })).length
                + ")", t: "s", s: this.getHeaderStyle()
        };
        cell.r += 1;
        ws[this.encodeCell(cell)] = {
            v: "Kombination", t: "s", s: this.getHeaderStyle()
        };
        cell.c += 1;
        ws[this.encodeCell(cell)] = {
            v: "Handlungsalternative", t: "s", s: this.getHeaderStyle()
        };
        alternativeWidth = this.updateWidth(alternativeWidth, "Handlungsalternative".length);
        cell.c += 1;
        ws[this.encodeCell(cell)] = {
            v: "Beschreibung", t: "s", s: this.getHeaderStyle()
        };
        descWidth = this.updateWidth(descWidth, "Beschreibung".length);
        cell.c = 0;
        cell.r += 1;

        for (const action of classifications.actions) {
            if (!action.alreadyAdded) {
                ws[this.encodeCell(cell)] = {v: action.name, t: "s"};
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.name, t: "s"};
                alternativeWidth = this.updateWidth(alternativeWidth, action.action.name.length);
                cell.c += 1;
                ws[this.encodeCell(cell)] = {v: action.action.desc, t: "s"};
                descWidth = this.updateWidth(descWidth, action.action.desc.length);
                cell.c = 0;
                cell.r += 1;
            }
        }

        ws["!cols"] = [
            {
                wch: 11
            },
            {
                wch: alternativeWidth
            },
            {
                wch: descWidth
            }
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
        let descWidth = 0;

        for (const table of tablesData) {
            ws[this.encodeCell(cell)] = {v: table.name, t: "s", s: this.getHeaderStyle()};
            cell.r++;

            ws[this.encodeCell(cell)] = {v: "Bezeichnung", t: "s", s: this.getHeaderStyle()};
            cell.c++;
            ws[this.encodeCell(cell)] = {v: "Name", t: "s", s: this.getHeaderStyle()};
            cell.c++;
            ws[this.encodeCell(cell)] = {v: "Beschreibung", t: "s", s: this.getHeaderStyle()};
            cell.c = 0;
            cell.r++;

            for (const tableElement of table.d as CardComponentFields) {
                ws[this.encodeCell(cell)] = {v: tableElement.id, t: "s"};
                cell.c++;
                ws[this.encodeCell(cell)] = {v: tableElement.name, t: "s"};
                nameWidth = this.updateWidth(nameWidth, tableElement.name.length);
                cell.c++;
                ws[this.encodeCell(cell)] = {v: tableElement.desc, t: "s"};
                descWidth = this.updateWidth(descWidth, tableElement.desc.length);
                cell.r++;
                cell.c = 0;
            }
            cell.r += 3;
        }

        range.e.r = cell.r;

        ws["!cols"] = [
            {
                wch: 11
            },
            {
                wch: nameWidth
            },
            {
                wch: descWidth
            }
        ]

        ws["!ref"] = this.encodeRange(range);
        return ws;
    }

}


export {
    SWOTExcelExporter
}
