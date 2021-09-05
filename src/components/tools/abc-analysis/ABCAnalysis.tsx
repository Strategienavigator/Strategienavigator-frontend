import {faChartPie} from "@fortawesome/free-solid-svg-icons";
import {Tool} from "../../../general-components/Tool/Tool";
import {SaveResource} from "../../../general-components/Datastructures";

import "./abc-analysis.scss";


class ABCAnalysis extends Tool {

    constructor(props: any) {
        super(props);

        this.setID(4);
        this.setToolname("ABC Analyse");
        this.setToolIcon(faChartPie);
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

    protected renderNew() {
        return this.getStepComponent();
    }

    protected renderView(tool: SaveResource) {
        return this.getStepComponent();
    }
}

export {
    ABCAnalysis
}