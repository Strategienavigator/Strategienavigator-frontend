import React, {Component} from "react";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {faSortAmountDownAlt, faThLarge} from "@fortawesome/free-solid-svg-icons";
import {SWOTFactors} from "./steps/SWOTFactors";
import {SWOTAlternativeActions} from "./steps/SWOTAlternativeActions";
import {SWOTClassifyAlternativeActions} from "./steps/SWOTClassifyAlternativeActions";
import "./swot-analysis.scss";
import {FormComponent} from "../../../general-components/Form/FormComponent";
import {Container} from "react-bootstrap";

export class SWOTAnalysis extends Component<any, any> {

    render() {
        return (
            <Container>
                <StepComponent
                    header={"SWOT Analyse"}
                    onSave={this.save}
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
                    controlFooterTool={{
                        tool: {
                            title: "SWOT-Start",
                            link: "/swot-analysis",
                            icon: faThLarge
                        }
                    }}
                />
            </Container>
        );
    }

    save = async (data: any, forms: Map<string, FormComponent<any, any>>) => {
        return true;
    }

}
