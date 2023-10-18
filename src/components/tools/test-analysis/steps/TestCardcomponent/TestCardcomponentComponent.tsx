import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";

export interface TestCardcomponentValues {

}

interface TestCardcomponentComponentState {

}

class TestCardcomponentComponent extends Step<TestAnalysisValues,TestCardcomponentComponentState> {

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
    TestCardcomponentComponent
}