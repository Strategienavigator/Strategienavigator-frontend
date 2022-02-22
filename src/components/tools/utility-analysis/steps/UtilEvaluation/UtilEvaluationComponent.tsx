import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";


export interface UtilEvaluationValues {

}

class UtilEvaluationComponent extends Step<UtilityAnalysisValues, {}> {


    public constructor(props: Readonly<StepProp<UtilEvaluationValues>> | StepProp<UtilEvaluationValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        return <div/>;
    }

}

export {
    UtilEvaluationComponent
};
