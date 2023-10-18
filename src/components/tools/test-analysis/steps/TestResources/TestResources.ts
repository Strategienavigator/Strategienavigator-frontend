import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestResourcesComponent} from "./TestResourcesComponent";

class TestResources implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;

    constructor() {
        this.id = "test-resources";
        this.title = "3. Resourcen";
        this.dataHandler = this;
        this.form = TestResourcesComponent;
        
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-resources"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-resources"] = {};
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-resources"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }
    

}

export {
    TestResources
}