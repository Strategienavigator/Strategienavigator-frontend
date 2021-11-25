import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import {SaveResource} from "../../../../general-components/Datastructures";

class SWOTExcelExporter extends ExcelExporter<SWOTAnalysisValues>{
    protected buildExcel(data: SaveResource<SWOTAnalysisValues>): object {
        return {};
    }
}


export {
    SWOTExcelExporter
}
