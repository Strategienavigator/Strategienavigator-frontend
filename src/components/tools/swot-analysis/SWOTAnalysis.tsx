import "./swot-analysis.scss";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import React from "react";

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
            </div>
        );
    }

}

export default SWOTAnalysis;