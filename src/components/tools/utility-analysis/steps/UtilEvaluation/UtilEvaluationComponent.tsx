import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";


export interface UtilEvaluationValues {

}

class UtilEvaluationComponent extends Step<UtilityAnalysisValues, {}> {


    public constructor(props: Readonly<StepProp<UtilEvaluationValues>> | StepProp<UtilEvaluationValues>, context: any) {
        super(props, context);
    }


    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => oldData["ua-evaluation"] === newData["ua-evaluation"]
        );
    }

    build(): JSX.Element {
        return <div/>;
    }

}

export {
    UtilEvaluationComponent
};
