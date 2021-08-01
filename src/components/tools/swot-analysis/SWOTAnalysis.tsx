import "./swot-analysis.scss";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import React from "react";
import {isDesktop} from "../../../general-components/Desktop";
import FixedFooter from "../../../general-components/FixedFooter/FixedFooter";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons/faSortAmountDownAlt";

class SWOTAnalysis extends StepComponent<any, any> {

    constructor(props: any) {
        super(props, "SWOT Analyse");

        this.addStep(this.step1, "Faktoren bearbeiten und hinzufügen");
        this.addStep(this.step2, "Handlungsalternativen festlegen");
        this.addStep(this.step3, "Handlungsalternativen klassifizieren");
    }

    step1 = (): React.ReactElement => {
        return (<div>Step 1</div>);
    }

    step2 = (): React.ReactElement => {
        return (<div>Step 2</div>);
    }

    step3 = (): React.ReactElement => {
        return (<div>Step 3</div>);
    }

    render() {
        return (
            <div className={"container"}>
                {super.render()}

                {(!isDesktop() && !this.isLastStep()) && (
                    <FixedFooter
                        home
                        tool={{icon: faSortAmountDownAlt, link: "/swot-analysis", title: "Start SWOT"}}
                        nextStep={{onNextStep: this.nextStep}}
                    />
                )}
                {(!isDesktop() && this.isLastStep()) && (
                    <FixedFooter
                        home
                        tool={{icon: faSortAmountDownAlt, link: "/swot-analysis", title: "Start SWOT"}}
                        exportAndShare
                    />
                )}
            </div>
        );
    }

}

export default SWOTAnalysis;