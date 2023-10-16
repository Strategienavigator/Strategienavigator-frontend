import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";

export interface TemplateStep2Values {

}

interface TemplateStep2ComponentState {

}

class TemplateStep2Component extends Step<TemplateAnalysisValues,TemplateStep2ComponentState> {

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
    TemplateStep2Component
}