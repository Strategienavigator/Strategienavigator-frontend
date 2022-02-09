import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";

import "./pairwise-comparison.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";


class PairwiseComparison extends SteppableTool<any> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Paarweiser Vergleich", faSortAmountDownAlt, 3);

        this.setMaintenance(true);
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

    protected getInitData(): any {
    }


}

export {
    PairwiseComparison
}
