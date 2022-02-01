import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {PCCriterias} from "./steps/PCCriterias";
import {PCPairComparison} from "./steps/PCPairComparison";

import "./pairwise-comparison.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";


class PairwiseComparison extends SteppableTool<any> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Paarweiser Vergleich", faSortAmountDownAlt, 3);

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

    protected getSaveViewBuilder(save:SaveResource<any>) {
        return this.getStepComponent();
    }
}

export {
    PairwiseComparison
}
