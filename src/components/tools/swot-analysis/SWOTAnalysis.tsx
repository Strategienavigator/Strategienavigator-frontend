import "./swot-analysis.scss";
import StepComponent, {SingleStep} from "../../../general-components/StepComponent/StepComponent";
import React from "react";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons/faSortAmountDownAlt";

class SWOTAnalysis extends StepComponent<any, any> {

    constructor(props: any) {
        super(props, "SWOT Analyse", {icon: faSortAmountDownAlt, link: "/swot-analysis", title: "Start SWOT"});
    }

    render() {
        return (
            <div className={"container"}>
                {super.render()}
            </div>
        );
    }

    save(steps: Array<SingleStep>): any {
    }

}

export default SWOTAnalysis;