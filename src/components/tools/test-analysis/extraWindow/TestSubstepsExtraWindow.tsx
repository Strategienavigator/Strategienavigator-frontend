import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {TestAnalysisValues} from "../TestAnalysis";

import "./test-substeps-extra-window.scss";

interface TestSubstepsExtraWindowState {

}

class TestSubstepsExtraWindow extends ExtraWindowComponent<TestAnalysisValues, TestSubstepsExtraWindowState> {

    render() {
        return (
            <>
                Hallo Welt!
            </>
        )
    }

}

export {
    TestSubstepsExtraWindow
}