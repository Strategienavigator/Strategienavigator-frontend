import "./pairwise-comparison.scss";
import StepComponent from "../../../general-components/StepComponent/StepComponent";
import PCCriterias from "./steps/PCCriterias";
import {Component} from "react";
import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import PCPairComparison from "./steps/PCPairComparison";
import FormComponent from "../../../general-components/Form/FormComponent";

class PairwiseComparison extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <StepComponent
                    steps={[
                        {
                            form: <PCCriterias/>,
                            title: "Kritierien festlegen",
                            id: "criterias"
                        },
                        {
                            form: <PCPairComparison/>,
                            title: "Paarvergleich",
                            id: "comparison"
                        }
                    ]}
                    header={"Paarweiser Vergleich"}
                    fixedFooterToolProp={{
                        title: "PV-Start",
                        link: "/pairwise-comparison",
                        icon: faSortAmountDownAlt
                    }}
                    onSave={(e) => this.save(e)}
                />
            </div>
        );
    }

    save = async (forms: Array<FormComponent<any, any>>) => {
        // forms[1].getValues() as PCPairComparisonValues;
        return true;
    }

}

export default PairwiseComparison;