
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";


export interface UtilResultValues {

}

class UtilResultComponent extends Step<UtilityAnalysisValues, any> {


    constructor(props: Readonly<StepProp<UtilResultValues>> | StepProp<UtilResultValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        return <div/>;
    }

}

export {
    UtilResultComponent
};
