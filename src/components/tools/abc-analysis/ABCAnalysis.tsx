import {faChartPie} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";

import "./abc-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";


class ABCAnalysis extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(4);
        this.setToolname("ABC Analyse");
        this.setToolIcon(faChartPie);
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

    protected renderView(tool: SaveResource) {
        return this.getStepComponent();
    }
}

export {
    ABCAnalysis
}
