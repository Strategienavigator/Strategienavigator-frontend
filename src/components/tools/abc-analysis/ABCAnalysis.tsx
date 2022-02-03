import {faChartPie} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";

import "./abc-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";
import {ToolSaveProps} from "../../../general-components/Tool/ToolSavePage/ToolSavePage";


class ABCAnalysis extends SteppableTool<any> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "ABC Analyse", faChartPie, 4);
        this.setMaintenance(true);
    }

    protected renderToolHome() {
        return null;
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return null;
    }

    protected buildSaveBuilder(saveProps: ToolSaveProps<any>): JSX.Element {
        return this.getStepComponent(saveProps);
    }
}

export {
    ABCAnalysis
}
