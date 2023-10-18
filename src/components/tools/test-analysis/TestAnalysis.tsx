import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {ReactNode} from "react";
import {RouteComponentProps} from "react-router";
import {faCube} from "@fortawesome/free-solid-svg-icons";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import {TestAnalysisExcelExporter} from "./export/TestAnalysisExcelExporter";
import {TestAnalysisJSONImporter} from "./import/TestAnalysisJSONImporter";
import {TestCardcomponent} from "./steps/TestCardcomponent/TestCardcomponent";
import {TestCardcomponentValues} from "./steps/TestCardcomponent/TestCardcomponentComponent";
import {TestComparecomponent} from "./steps/TestComparecomponent/TestComparecomponent";
import {TestComparecomponentValues} from "./steps/TestComparecomponent/TestComparecomponentComponent";
import {TestResources} from "./steps/TestResources/TestResources";
import {TestResourcesValues} from "./steps/TestResources/TestResourcesComponent";
import {TestSubsteps} from "./steps/TestSubsteps/TestSubsteps";
import {TestSubstepsValues} from "./steps/TestSubsteps/TestSubstepsComponent";

import "./test-analysis.scss";
import * as process from "process";
import {TestCoordinateSystemValues} from "./steps/TestCoordinateSystem/TestCoordinateSystemComponent";
import {TestCoordinateSystem} from "./steps/TestCoordinateSystem/TestCoordinateSystem";

export interface TestAnalysisValues {
    "test-cardcomponent"?: TestCardcomponentValues,
	"test-comparecomponent"?: TestComparecomponentValues,
	"test-resources"?: TestResourcesValues,
	"test-substeps"?: TestSubstepsValues,
    "test-coordinate-system"?: TestCoordinateSystemValues
}

/**
* Repräsentiert das Tool "Test-Analyse"
*/
class TestAnalysis extends SteppableTool<TestAnalysisValues> {

    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Test-Analyse (DEV only)", faCube, 9999);

        // Wartungarbeiten?
        this.setMaintenance(process.env.NODE_ENV !== "development");

        // Exports
        this.addExporter(new JSONExporter());
		this.addExporter(new TestAnalysisExcelExporter());

        // Imports
        this.setImporter(new TestAnalysisJSONImporter());

        // Schritte
        this.addStep(new TestCardcomponent());
		this.addStep(new TestComparecomponent());
		this.addStep(new TestResources());
		this.addStep(new TestSubsteps());
        this.addStep(new TestCoordinateSystem());
    }

    protected getInitData(): TestAnalysisValues {
        let data = {
            "test-cardcomponent": undefined,
			"test-comparecomponent": undefined,
			"test-resources": undefined,
			"test-substeps": undefined,
            "test-coordinate-system": undefined
        };
        this.getStep(0).dataHandler.fillFromPreviousValues(data);
        return data;
    }

    protected renderShortDescription(): ReactNode {
        return (
            <>
                Ich bin eine Shortdescription!
            </>
        );
    }

    protected renderTutorial(): ReactNode {
        return (
            <>
                Ich bin ein Tutorial. Ich erscheine auf der linken Seite!
            </>
        );
    }

}

export {
    TestAnalysis
}