import "./swot-analysis.scss";
import React, {Component} from "react";
import StepComponent from "../../../general-components/StepComponent/StepComponent";

class SWOTAnalysis extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <StepComponent
                    steps={[]}
                    header={"SWOT Analyse"}
                />
            </div>
        );
    }

}

export default SWOTAnalysis;