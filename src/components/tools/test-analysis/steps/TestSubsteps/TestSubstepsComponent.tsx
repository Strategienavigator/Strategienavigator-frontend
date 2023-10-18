import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";

export interface TestSubstepsValues {

}

interface TestSubstepsComponentState {

}

class TestSubstepsComponent extends Step<TestAnalysisValues,TestSubstepsComponentState> {

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
    TestSubstepsComponent
}