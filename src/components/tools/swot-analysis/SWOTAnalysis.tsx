import "./swot-analysis.scss";
import React, {Component} from "react";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";

class SWOTAnalysis extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <StepComponent
                    controlFooterTool={{
                        tool: {
                            title: "SWOT-Start",
                            link: "/swot-analysis",
                            icon: faSortAmountDownAlt
                        }
                    }}
                    steps={[]}
                    header={"SWOT Analyse"}
                    maintenance={true}
                />
            </div>
        );
    }

}

export default SWOTAnalysis;