import React, {Component} from "react";
import ToolFrontpage from "../../../general-components/Tool/Frontpage/ToolFrontpage";

class PairwiseComparisonHome extends Component<any, any> {

    render() {
        return (
            <ToolFrontpage tool={3} link={"/pairwise-comparison"}>
                <h4>Paarweiser Vergleich</h4>

                <small>Es sollten Kriterien festgelegt werden, welche anschließend Paarweise verglichen und gewichtet
                    werden.</small>
            </ToolFrontpage>
        );
    }

}

export default PairwiseComparisonHome;