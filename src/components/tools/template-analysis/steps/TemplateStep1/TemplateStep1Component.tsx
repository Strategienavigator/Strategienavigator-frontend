import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TemplateAnalysisValues} from "../../TemplateAnalysis";

export interface TemplateStep1Values {

}

interface TemplateStep1ComponentState {

}

class TemplateStep1Component extends Step<TemplateAnalysisValues, TemplateStep1ComponentState> {

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
    TemplateStep1Component
}