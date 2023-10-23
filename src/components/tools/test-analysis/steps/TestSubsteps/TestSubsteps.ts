import {
    CustomNextButton,
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
    customNextButton: CustomNextButton

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
        this.customNextButton = {text: "Nächster"};
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-substeps"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-substeps"] = {
            ratings: [0]
        };
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
        return 10;
    }

    isStepUnlocked(subStep: number, data: TestAnalysisValues): boolean {
        return subStep < 1 || this.validateStep(subStep - 1, data).length === 0;
    }

    validateStep(subStep: number, data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        let ratings = data["test-substeps"]?.ratings;
        if (ratings && ratings.length <= subStep) {
            errors.push({
               level: "error",
               id: "rating.empty",
               message: "Bitte geben Sie eine Bewertung an!"
            });
        }

        return errors;
    }

}

export {
    TestSubsteps
}