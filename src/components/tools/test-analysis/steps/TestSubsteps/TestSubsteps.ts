import {
    ExtraWindowDefinition,
    StepDataHandler,
    StepDefinition,
    SubStepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestSubstepsExtraWindow} from "../../extraWindow/TestSubstepsExtraWindow";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestSubstepsComponent} from "./TestSubstepsComponent";

class TestSubsteps implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues>, SubStepDefinition<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;
    extraWindow: ExtraWindowDefinition<TestAnalysisValues>;
    subStep: SubStepDefinition<TestAnalysisValues>;

    constructor() {
        this.id = "test-substeps";
        this.title = "4. SubSteps";
        this.dataHandler = this;
        this.form = TestSubstepsComponent;
        this.extraWindow = {
            displayName: "SubSteps",
            extraWindowComponent: TestSubstepsExtraWindow,
        };
        this.subStep = this;
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-substeps"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-substeps"] = {};
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-substeps"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }

    getStepCount(data: TestAnalysisValues): number {
        return 0;
    }

    isStepUnlocked(subStep: number, data: TestAnalysisValues): boolean {
        return false;
    }

    validateStep(subStep: number, data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }

}

export {
    TestSubsteps
}