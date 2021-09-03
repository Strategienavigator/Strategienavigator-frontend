import StepComponent from "../../../general-components/StepComponent/StepComponent";
import {Component} from "react";
import {Container} from "react-bootstrap";
import {FormComponent} from "../../../general-components/Form/FormComponent";
import {faChartPie} from "@fortawesome/free-solid-svg-icons";


class ABCAnalysis extends Component<any, any> {

    render = () => {
        return (
            <Container>
                <StepComponent
                    header={"ABC Analyse"}
                    onSave={this.save}
                    steps={[]}
                    controlFooterTool={{
                        tool: {
                            icon: faChartPie,
                            title: "ABC Analyse",
                            link: "/abc-analysis"
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
    ABCAnalysis
}