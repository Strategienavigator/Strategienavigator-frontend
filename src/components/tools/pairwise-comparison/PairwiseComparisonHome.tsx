import React, {Component} from "react";
import {isDesktop} from "../../../general-components/Desktop";
import FixedFooter from "../../../general-components/FixedFooter/FixedFooter";

class PairwiseComparisonHome extends Component<any, any> {
    render() {
        return (
            <div className={"container"}>
                <h4>Paarweiser Vergleich</h4>

                <small>Es sollten Kriterien festgelegt werden, welche anschließend Paarweise verglichen und gewichtet
                    werden.</small>

                {!isDesktop() && (
                    <FixedFooter home settings newTool={{link: "/pairwise-comparison/new", title: "Neue Analyse"}}/>
                )}
            </div>
        );
    }
}

export default PairwiseComparisonHome;