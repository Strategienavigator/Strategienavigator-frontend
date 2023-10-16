import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";

export interface TemplateStep3Values {

}

interface TemplateStep3ComponentState {

}

class TemplateStep3Component extends Step<TemplateAnalysisValues,TemplateStep3ComponentState> {

    public constructor(props: StepProp<TemplateAnalysisValues> | Readonly<StepProp<TemplateAnalysisValues>>) {
        super(props);
    }

    protected build(): JSX.Element {
        return (
            <>
                Hallo Welt!
            </>
        );
    }

}

export {
    TemplateStep3Component
}