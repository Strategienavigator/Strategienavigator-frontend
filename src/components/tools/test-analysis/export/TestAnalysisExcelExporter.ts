import {ExcelExporter} from "../../../../general-components/Export/ExcelExporter";
import XLSX, {Range, WorkBook, WorkSheet} from "xlsx-js-style";
import {SaveResource} from "../../../../general-components/Datastructures";
import {TestAnalysisValues} from "../TestAnalysis";
import {TestCardcomponentValues} from "../steps/TestCardcomponent/TestCardcomponentComponent";
import {TestComparecomponentValues} from "../steps/TestComparecomponent/TestComparecomponentComponent";
import {TestResourcesValues} from "../steps/TestResources/TestResourcesComponent";
import {TestSubstepsValues} from "../steps/TestSubsteps/TestSubstepsComponent";
import {TestCoordinateSystemValues} from "../steps/TestCoordinateSystem/TestCoordinateSystemComponent";


class TestAnalysisExcelExporter extends ExcelExporter<TestAnalysisValues> {

    protected buildExcel(workbook: WorkBook, data: SaveResource<TestAnalysisValues>): boolean {
        let testcardcomponent = data.data["test-cardcomponent"];
        if (this.isFilled(testcardcomponent))
            this.addSheet("1. CardComponent", this.getTestCardcomponentValues(testcardcomponent));

        let testcomparecomponent = data.data["test-comparecomponent"];
        if (this.isFilled(testcomparecomponent))
            this.addSheet("2. CompareComponent", this.getTestComparecomponentValues(testcomparecomponent));

        let testresources = data.data["test-resources"];
        if (this.isFilled(testresources))
            this.addSheet("3. Resourcen", this.getTestResourcesValues(testresources));

        let testsubsteps = data.data["test-substeps"];
        if (this.isFilled(testsubsteps))
            this.addSheet("4. SubSteps", this.getTestSubstepsValues(testsubsteps));

        let testcoordinatesystem = data.data["test-coordinate-system"];
        if (this.isFilled(testcoordinatesystem))
            this.addSheet("5. CoordinateSystem", this.getTestCoordinateSystemValues(testcoordinatesystem));


        return true;
    }

    private getTestCardcomponentValues(values: TestCardcomponentValues): WorkSheet {
        let ws: WorkSheet = {};
        // let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTestComparecomponentValues(values: TestComparecomponentValues): WorkSheet {
        let ws: WorkSheet = {};
        // let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTestResourcesValues(values: TestResourcesValues): WorkSheet {
        let ws: WorkSheet = {};
        // let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTestSubstepsValues(values: TestSubstepsValues): WorkSheet {
        let ws: WorkSheet = {};
        // let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }

    private getTestCoordinateSystemValues(values: TestCoordinateSystemValues): WorkSheet {
        let ws: WorkSheet = {};
        // let cell = {r: 0, c: 0};

        let range: Range = {
            s: {r: 0, c: 0},
            e: {r: 0, c: 0}
        }
        ws["!ref"] = XLSX.utils.encode_range(range);
        return ws;
    }


}

export {
    TestAnalysisExcelExporter
}