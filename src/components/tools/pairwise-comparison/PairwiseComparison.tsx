import "./pairwise-comparison.scss";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import React from "react";
import {isDesktop} from "../../../general-components/Desktop";
import FixedFooter from "../../../general-components/FixedFooter/FixedFooter";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons/faSortAmountDownAlt";

class PairwiseComparison extends StepComponent<any, any> {

    constructor(props: any) {
        super(props, "Paarweiser Vergleich");

        this.addStep(this.step1, "Kritierien festlegen");
        this.addStep(this.step2, "Paarvergleich");
        this.addStep(this.step3, "Ergebnismatrix");
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
                        tool={{icon: faSortAmountDownAlt, link: "/pairwise-comparison", title: "Start PV"}}
                        nextStep={{onNextStep: this.nextStep}}
                    />
                )}
                {(!isDesktop() && this.isLastStep()) && (
                    <FixedFooter
                        home
                        tool={{icon: faSortAmountDownAlt, link: "/pairwise-comparison", title: "Start PV"}}
                        exportAndShare
                    />
                )}
            </div>
        );
    }

}

export default PairwiseComparison;