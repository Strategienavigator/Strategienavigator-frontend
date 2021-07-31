import React, {Component} from "react";
import ToolFrontpage from "../../../general-components/Tool/Frontpage/ToolFrontpage";

class SWOTAnalysisHome extends Component<any, any> {

    render() {
        return (
            <ToolFrontpage tool={1} link={"/swot-analysis"}>
                <h4>SWOT Analyse</h4>
            </ToolFrontpage>
        );
    }

}

export default SWOTAnalysisHome;