import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";

export interface TestComparecomponentValues {

}

interface TestComparecomponentComponentState {

}

class TestComparecomponentComponent extends Step<TestAnalysisValues,TestComparecomponentComponentState> {

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
    TestComparecomponentComponent
}