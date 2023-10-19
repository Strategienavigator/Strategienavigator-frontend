import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";

export interface TestCoordinateSystemValues {

}

interface TestCoordinateSystemComponentState {

}

class TestCoordinateSystemComponent extends Step<TestAnalysisValues, TestCoordinateSystemComponentState> {

    public constructor(props: StepProp<TestAnalysisValues> | Readonly<StepProp<TestAnalysisValues>>) {
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
    TestCoordinateSystemComponent
}