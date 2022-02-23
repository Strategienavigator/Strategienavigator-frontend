import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";


export interface UtilResultValues {

}

class UtilResultComponent extends Step<UtilityAnalysisValues, any> {


    public constructor(props: Readonly<StepProp<UtilResultValues>> | StepProp<UtilResultValues>, context: any) {
        super(props, context);
    }


    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<any>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => oldData["ua-result"] === newData["ua-result"]
        );
    }

    build(): JSX.Element {
        return <div/>;
    }

}

export {
    UtilResultComponent
};
