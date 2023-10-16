import {
    StepDataHandler,
    StepDefinition,
	ExtraWindowDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TemplateStep2ExtraWindow} from "../../extraWindow/TemplateStep2ExtraWindow";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";
import {TemplateStep2Component} from "./TemplateStep2Component";

class TemplateStep2 implements StepDefinition<TemplateAnalysisValues>, StepDataHandler<TemplateAnalysisValues> {
    form: FunctionComponent<StepProp<TemplateAnalysisValues>> | ComponentClass<StepProp<TemplateAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TemplateAnalysisValues>;
	extraWindow: ExtraWindowDefinition<TemplateAnalysisValues>;

    constructor() {
        this.id = "template-step-2";
        this.title = "2. Schritt 2: Mit ExtraWindow";
        this.dataHandler = this;
        this.form = TemplateStep2Component;
        this.extraWindow = {
			displayName: "ExtraWindow",
			extraWindowComponent: TemplateStep2ExtraWindow,
		};
    }

    deleteData(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-2"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TemplateAnalysisValues>): void {
        data["template-step-2"] = {};
    }

    isUnlocked(data: TemplateAnalysisValues): boolean {
        return data["template-step-2"] !== undefined;
    }

    validateData(data: TemplateAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        // Validierung
        // ...

        return errors;
    }
    

}

export {
    TemplateStep2
}