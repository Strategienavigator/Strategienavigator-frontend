import {ExcelExporter} from "../Export/ExcelExporter";
import {SaveResource} from "../Datastructures";
import {CellAddress, CellObject, Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {CardComponentFields} from "./CardComponent";


interface CustomDescriptionCellObject {
    object: CellObject,
    header: string
}

class CardComponentExcelWorkSheet<CD = object> extends ExcelExporter<any> {
    private readonly header?: string = "Kriterium";
    private readonly values: CardComponentFields<CD>;
    private readonly onCustomDescriptionRender?: ((extras: CD) => CustomDescriptionCellObject[]);
    private readonly starterCell: CellAddress = {c: 0, r: 0};

    constructor(cardComponent: CardComponentFields<CD>, header?: string, onCustomDescriptionRender?: (extras: CD) => CustomDescriptionCellObject[], startCell?: CellAddress) {
        super();
        this.values = cardComponent;
        this.header = header;
        this.onCustomDescriptionRender = onCustomDescriptionRender;

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
        let fieldLength = this.header?.length ?? 9;
        let descLength = 12;
        let cdLengths: number[] = [];

        // Header
        ws[this.encodeCell(cell)] = {
            v: this.header, t: "s", s: this.getHeaderStyle()
        };
        cell.c = 1;
        ws[this.encodeCell(cell)] = {
            v: "Beschreibung", t: "s", s: this.getHeaderStyle()
        };

        if (this.onCustomDescriptionRender !== undefined && this.values[0].extra !== undefined) {
            cdLengths = this.onCustomDescriptionRender(this.values[0].extra).map((value) => {
                return 0;
            });

            let i = 0;
            for (const extraField of this.onCustomDescriptionRender(this.values[0].extra)) {
                cell.c += 1;
                ws[this.encodeCell(cell)] = {
                    v: extraField.header, t: "s", s: this.getHeaderStyle()
                };
                cdLengths[i] = this.updateWidth(cdLengths[i], extraField.header.length);
                i++;
            }
        }
        cell.c = 0;

        for (let field of this.values) {
            cell.r += 1;
            cell.c = 0;

            ws[this.encodeCell(cell)] = {
                v: field.name, t: "s"
            }
            fieldLength = this.updateWidth(fieldLength, field.name.length);
            cell.c = 1;
            ws[this.encodeCell(cell)] = {
                v: field.desc, t: "s"
            }
            descLength = this.updateWidth(descLength, field.desc.length);

            if (this.onCustomDescriptionRender !== undefined && field.extra !== undefined && Object.keys(field.extra).length > 0) {
                let i = 0;
                for (const extraField of this.onCustomDescriptionRender(field.extra)) {
                    cell.c += 1;
                    ws[this.encodeCell(cell)] = extraField.object;
                    cdLengths[i] = this.updateWidth(cdLengths[i], String(extraField.object.v).length);
                    i++;
                }
            }
        }

        let range: Range = {s: {r: 0, c: 0}, e: cell}
        ws["!ref"] = this.encodeRange(range);

        ws["!cols"] = [
            {
                wch: fieldLength
            },
            {
                wch: descLength
            }
        ];
        ws["!cols"] = ws["!cols"]?.concat(cdLengths.map((length) => {
            return {
                wch: length
            };
        }));

        return ws;
    }

    protected buildExcel(workbook: WorkBook, data: SaveResource<any>): boolean {
        return false;
    }

}

export {
    CardComponentExcelWorkSheet
}