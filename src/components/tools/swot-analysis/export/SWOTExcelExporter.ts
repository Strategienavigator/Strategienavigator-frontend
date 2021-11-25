import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import {SaveResource} from "../../../../general-components/Datastructures";

class SWOTExcelExporter extends ExcelExporter<SWOTAnalysisValues>{
    protected buildExcel(workbook: XLSX.WorkBook, data: SaveResource<SWOTAnalysisValues>): boolean {

        let ws1 = this.addSheet("peter");

        var new_workbook = XLSX.utils.book_new();
        return true;
    }
}


export {
    SWOTExcelExporter
}
