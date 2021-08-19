import "./swot-analysis.scss";
import React, {Component} from "react";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import SWOTFactors from "./steps/SWOTFactors";
import SWOTAlternativeActions from "./steps/SWOTAlternativeActions";

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
                    steps={[
                        {
                            id: "swot-factors",
                            form: <SWOTFactors/>,
                            title: "1. Faktoren bearbeiten und hinzufügen"
                        },
                        {
                            id: "swot-alternate-actions",
                            form: <SWOTAlternativeActions/>,
                            title: "2. Handlungsalternativen festlegen"
                        }
                    ]}
                    header={"SWOT Analyse"}
                />
            </div>
        );
    }

}

export default SWOTAnalysis;