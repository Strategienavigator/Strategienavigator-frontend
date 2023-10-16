import {
    StepDataHandler,
    StepDefinition,
    SubStepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";
import {TemplateStep3Component} from "./TemplateStep3Component";

class TemplateStep3 implements StepDefinition<TemplateAnalysisValues>, StepDataHandler<TemplateAnalysisValues>, SubStepDefinition<TemplateAnalysisValues> {
    form: FunctionComponent<StepProp<TemplateAnalysisValues>> | ComponentClass<StepProp<TemplateAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TemplateAnalysisValues>;
    subStep: SubStepDefinition<TemplateAnalysisValues>;

    constructor() {
        this.id = "template-step-3";
        this.title = "3. Schritt 3: Mit Substep";
        this.dataHandler = this;
        this.form = TemplateStep3Component;
        this.subStep = this;
    }

    deleteData(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-3"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-3"] = {};
    }

    isUnlocked(data: TemplateAnalysisValues): boolean {
        return data["template-step-3"] !== undefined;
    }

    validateData(data: TemplateAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }

    getStepCount(data: TemplateAnalysisValues): number {
        return 0;
    }

    isStepUnlocked(subStep: number, data: TemplateAnalysisValues): boolean {
        return false;
    }

    validateStep(subStep: number, data: TemplateAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }

}

export {
    TemplateStep3
}