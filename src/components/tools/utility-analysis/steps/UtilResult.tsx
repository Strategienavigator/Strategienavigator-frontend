
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface UtilResultValues {

}

class UtilResult extends Step<UtilResultValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

}

export {
    UtilResult
};
export type {UtilResultValues};
