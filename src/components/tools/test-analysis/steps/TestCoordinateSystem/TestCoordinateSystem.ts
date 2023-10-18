import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestCoordinateSystemComponent} from "./TestCoordinateSystemComponent";

class TestCoordinateSystem implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;

    constructor() {
        this.id = "test-coordinate-system";
        this.title = "5. CoordinateSystem";
        this.dataHandler = this;
        this.form = TestCoordinateSystemComponent;
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-coordinate-system"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-coordinate-system"] = {};
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-coordinate-system"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }

}

export {
    TestCoordinateSystem
}