import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {Tool} from "../../../general-components/Tool/Tool";
import {SaveResource} from "../../../general-components/Datastructures";
import {PCCriterias} from "./steps/PCCriterias";
import {PCPairComparison} from "./steps/PCPairComparison";

import "./pairwise-comparison.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";


class PairwiseComparison extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(3);
        this.setToolname("Paarweiser Vergleich");
        this.setToolIcon(faSortAmountDownAlt);
        this.setMaintenance(true);

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
        return (
            <>
                Es sollten Kriterien festgelegt werden, welche anschließend Paarweise verglichen und gewichtet
                werden.
            </>
        );
    }

    protected renderTutorial() {
        return null;
    }

    protected renderView(tool: SaveResource) {
        return this.getStepComponent();
    }
}

export {
    PairwiseComparison
}
