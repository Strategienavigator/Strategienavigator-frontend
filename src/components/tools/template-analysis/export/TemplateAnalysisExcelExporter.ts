import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import XLSX, {Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../../../../general-components/Datastructures";
import {TemplateAnalysisValues} from "../TemplateAnalysis";
import {TemplateStep1Values} from "../steps/TemplateStep1/TemplateStep1Component";
import {TemplateStep2Values} from "../steps/TemplateStep2/TemplateStep2Component";
import {TemplateStep3Values} from "../steps/TemplateStep3/TemplateStep3Component";


class TemplateAnalysisExcelExporter extends ExcelExporter<TemplateAnalysisValues> {

    protected buildExcel(workbook: WorkBook, data: SaveResource<TemplateAnalysisValues>): boolean {
        let templatestep1 = data.data["template-step-1"];
        if (this.isFilled(templatestep1))
            this.addSheet("1. Schritt 1", this.getTemplateStep1Values(templatestep1));

        let templatestep2 = data.data["template-step-2"];
        if (this.isFilled(templatestep2))
            this.addSheet("2. Schritt 2: Mit ExtraWindow", this.getTemplateStep2Values(templatestep2));

        let templatestep3 = data.data["template-step-3"];
        if (this.isFilled(templatestep3))
            this.addSheet("3. Schritt 3: Mit Substep", this.getTemplateStep3Values(templatestep3));


        return true;
    }

    private getTemplateStep1Values(values: TemplateStep1Values): WorkSheet {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTemplateStep2Values(values: TemplateStep2Values): WorkSheet {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTemplateStep3Values(values: TemplateStep3Values): WorkSheet {
        let ws: WorkSheet = {};
        let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }


}

export {
    TemplateAnalysisExcelExporter
}