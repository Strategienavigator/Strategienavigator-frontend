import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {Component} from "react";
import {Container} from "react-bootstrap";
import {FormComponent} from "../../../general-components/Form/FormComponent";
import {faArrowsAlt} from "@fortawesome/free-solid-svg-icons";
import {UtilInvestigationObjects} from "./steps/UtilInvestigationObjects";
import {UtilCriterias} from "./steps/UtilCriterias";
import {UtilWeighting} from "./steps/UtilWeighting";
import {UtilEvaluation} from "./steps/UtilEvaluation";
import {UtilResult} from "./steps/UtilResult";

class UtilityAnalysis extends Component<any, any> {

    render = () => {
        return (
            <Container>
                <StepComponent
                    header={"Nutzwertanalyse"}
                    onSave={this.save}
                    steps={[
                        {
                            id: "utility-objects",
                            title: "1. Untersuchungsobjekte",
                            form: <UtilInvestigationObjects/>
                        },
                        {
                            id: "utility-criterias",
                            title: "2. Kriterien",
                            form: <UtilCriterias/>
                        },
                        {
                            id: "utility-weighting",
                            title: "3. Gewichtung",
                            form: <UtilWeighting/>
                        },
                        {
                            id: "utility-evaluation",
                            title: "4. Bewertung > Objekt nach Kriterien",
                            form: <UtilEvaluation/>
                        },
                        {
                            id: "utility-result",
                            title: "4. Bewertungsübersicht",
                            form: <UtilResult/>
                        }
                    ]}
                    controlFooterTool={{
                        tool: {
                            icon: faArrowsAlt,
                            title: "Nutzwertanalyse",
                            link: "/utility-analysis"
                        }
                    }}
                    maintenance
                />
            </Container>
        );
    }

    save = async (data: any, forms: Map<string, FormComponent<any, any>>) => {
        return true;
    }

}

export {
    UtilityAnalysis
}