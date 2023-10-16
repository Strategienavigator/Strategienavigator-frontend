import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {TemplateAnalysisValues} from "../TemplateAnalysis";

import "./template-step-2-extra-window.scss";

interface TemplateStep2ExtraWindowState {

}

class TemplateStep2ExtraWindow extends ExtraWindowComponent<TemplateAnalysisValues, TemplateStep2ExtraWindowState> {

    render() {
        return (
            <>
                Hallo Welt!
            </>
        )
    }

}

export {
    TemplateStep2ExtraWindow
}