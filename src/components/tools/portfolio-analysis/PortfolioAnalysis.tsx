import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {Component} from "react";
import {Container} from "react-bootstrap";
import {FormComponent} from "../../../general-components/Form/FormComponent";
import {faArrowsAlt} from "@fortawesome/free-solid-svg-icons";
import {PortCreateObjects} from "./steps/PortCreateObjects";
import {PortCriterias} from "./steps/PortCriterias";
import {PortWeighting} from "./steps/PortWeighting";
import {PortEvaluation} from "./steps/PortEvaluation";
import {PortResult} from "./steps/PortResult";


class PortfolioAnalysis extends Component<any, any> {

    render = () => {
        return (
            <Container>
                <StepComponent
                    header={"Portfolio Analyse"}
                    onSave={this.save}
                    steps={[
                        {
                            id: "portfolio-objects",
                            title: "1. Objekte anlegen",
                            form: <PortCreateObjects/>
                        },
                        {
                            id: "portfolio-criterias",
                            title: "2. Kriterien",
                            form: <PortCriterias/>
                        },
                        {
                            id: "portfolio-weighting",
                            title: "3. Gewichtung",
                            form: <PortWeighting/>
                        },
                        {
                            id: "portfolio-evaluation",
                            title: "4. Bewertung",
                            form: <PortEvaluation/>
                        },
                        {
                            id: "portfolio-result",
                            title: "5. Ergebnismatrix",
                            form: <PortResult/>
                        }
                    ]}
                    controlFooterTool={{
                        tool: {
                            icon: faArrowsAlt,
                            title: "Portfolio Analyse",
                            link: "/portfolio-analysis"
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
    PortfolioAnalysis
}