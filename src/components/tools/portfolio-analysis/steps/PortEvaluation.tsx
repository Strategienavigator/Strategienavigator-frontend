import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortEvaluationValues {

}

class PortEvaluation extends Step<PortEvaluationValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

}

export {
    PortEvaluation
};
export type {PortEvaluationValues};
