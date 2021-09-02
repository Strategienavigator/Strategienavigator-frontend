import React, {Component} from "react";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SWOTFactors} from "./steps/SWOTFactors";
import {SWOTAlternativeActions} from "./steps/SWOTAlternativeActions";
import {SWOTClassifyAlternativeActions} from "./steps/SWOTClassifyAlternativeActions";
import "./swot-analysis.scss";
import {FormComponent} from "../../../general-components/Form/FormComponent";

export class SWOTAnalysis extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <StepComponent
                    onSave={this.save}
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
                        },
                        {
                            id: "swot-classify-alternate-actions",
                            form: <SWOTClassifyAlternativeActions/>,
                            title: "3. Handlungsalternativen klassifizieren"
                        }
                    ]}
                    header={"SWOT Analyse"}
                />
            </div>
        );
    }

    save = async (forms: Map<string, FormComponent<any, any>>) => {
        let data = {};
        Object.assign(data, forms.get("swot-factors")?.getValues());
        Object.assign(data, forms.get("swot-alternate-actions")?.getValues());
        Object.assign(data, forms.get("swot-classify-alternate-actions")?.getValues());

        console.log(data);

        return true;
    }

}
