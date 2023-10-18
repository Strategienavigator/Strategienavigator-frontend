import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestComparecomponentComponent} from "./TestComparecomponentComponent";

class TestComparecomponent implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;

    constructor() {
        this.id = "test-comparecomponent";
        this.title = "2. CompareComponent";
        this.dataHandler = this;
        this.form = TestComparecomponentComponent;
        
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-comparecomponent"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-comparecomponent"] = {};
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-comparecomponent"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }
    

}

export {
    TestComparecomponent
}