import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {TestAnalysisValues} from "../TestAnalysis";

import "./test-substeps-extra-window.scss";
import {ProgressBar} from "react-bootstrap";

interface TestSubstepsExtraWindowState {

}

class TestSubstepsExtraWindow extends ExtraWindowComponent<TestAnalysisValues, TestSubstepsExtraWindowState> {

    render() {
        let ratings = this.props.data["test-substeps"]!.ratings;
        let current = ratings.length;
        return (
            <>
                <b>Fortschritt:</b>
                <ProgressBar
                    min={0}
                    now={current}
                    max={9}
                    striped
                    animated
                    variant={"primary"}
                />
                Aktueller Unterschritt: {current} / 10 <br/>
                Durchschnittsbewertung: {ratings.reduce((a, b) => a + b, 0) / current}
            </>
        )
    }

}

export {
    TestSubstepsExtraWindow
}