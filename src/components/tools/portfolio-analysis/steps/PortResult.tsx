import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortResultValues {

}

class PortResult extends Step<PortResultValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

}

export {
    PortResult
};
export type {PortResultValues};
