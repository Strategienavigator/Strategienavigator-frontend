import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {PCCriterias, PCCriteriasValues} from "./steps/PCCriterias";
import {PCPairComparison, PCPairComparisonValues} from "./steps/PCPairComparison";

import "./pairwise-comparison.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";

interface PairwiseComparisonValues {
    "pc-criterias": PCCriteriasValues,
    "pc-comparison": PCPairComparisonValues
}

class PairwiseComparison extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(3);
        this.setToolname("Paarweiser Vergleich");
        this.setToolIcon(faSortAmountDownAlt);
        this.setMaintenance(false);

        this.addStep({
            form: <PCCriterias/>,
            title: "1. Kritierien festlegen",
            id: "pc-criterias"
        });
        this.addStep({
            form: <PCPairComparison/>,
            title: "2. Paarvergleich",
            id: "pc-comparison"
        });
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

    protected renderView(save: SaveResource<PairwiseComparisonValues>) {
        this.setValues("pc-criterias", save.data["pc-criterias"])
        this.setValues("pc-comparison", save.data["pc-comparison"])

        return this.getStepComponent();
    }
}

export {
    PairwiseComparison
}
