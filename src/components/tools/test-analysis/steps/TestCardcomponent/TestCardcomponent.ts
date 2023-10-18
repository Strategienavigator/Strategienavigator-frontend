import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestCardcomponentComponent} from "./TestCardcomponentComponent";

class TestCardcomponent implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;

    constructor() {
        this.id = "test-cardcomponent";
        this.title = "1. CardComponent";
        this.dataHandler = this;
        this.form = TestCardcomponentComponent;
        
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-cardcomponent"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-cardcomponent"] = {};
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-cardcomponent"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }
    

}

export {
    TestCardcomponent
}