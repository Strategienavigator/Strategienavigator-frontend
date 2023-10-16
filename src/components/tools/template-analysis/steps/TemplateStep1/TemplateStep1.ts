import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";
import {TemplateStep1Component} from "./TemplateStep1Component";

class TemplateStep1 implements StepDefinition<TemplateAnalysisValues>, StepDataHandler<TemplateAnalysisValues> {
    form: FunctionComponent<StepProp<TemplateAnalysisValues>> | ComponentClass<StepProp<TemplateAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TemplateAnalysisValues>;

    constructor() {
        this.id = "template-step-1";
        this.title = "1. Schritt 1";
        this.dataHandler = this;
        this.form = TemplateStep1Component;
        
    }

    deleteData(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-1"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-1"] = {};
    }

    isUnlocked(data: TemplateAnalysisValues): boolean {
        return data["template-step-1"] !== undefined;
    }

    validateData(data: TemplateAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }
    

}

export {
    TemplateStep1
}