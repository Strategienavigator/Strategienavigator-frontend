import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    CompareComponent,
    CompareComponentValues
} from "../../../../../general-components/CompareComponent/CompareComponent";
import {LinearCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/LinearCardComponentFieldsAdapter";
import {PortEvaluation} from "./PortEvaluation";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {Accordion} from "react-bootstrap";


interface PortEvaluationValues {
    evaluation: {
        criteriaIndex: number,
        rating: CompareComponentValues
    }[]
}

class PortEvaluationComponent extends Step<PortfolioAnalysisValues, {}> {
    private index: number = -1;

    public constructor(props: StepProp<PortfolioAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PortfolioAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps, (oldData, newData) => {
            return oldData["port-evaluation"] === newData["port-evaluation"];
        });
    }

    build(): JSX.Element {
        this.index = -1;
        return (
          <>
              {(isDesktop()) ? this.desktop() : this.mobile()}

              <UIErrorBanner id={"port-evaluation.empty"} />
          </>
        );
    }

    getCompareComponents(type: "attractivity" | "comp-standing"): JSX.Element[] {
        let allValues = this.props.save.data["port-evaluation"]?.evaluation;
        let allCriterias = this.props.save.data["port-criterias"];
        let objects = this.props.save.data["port-objects"];
        let criterias: CardComponentFields;

        if (allCriterias?.attractivity !== undefined && allCriterias["comp-standing"] !== undefined && objects !== undefined) {
            if (type === "attractivity") {
                criterias = allCriterias?.attractivity;
            } else {
                criterias = allCriterias?.["comp-standing"];
            }

            let adapter = new LinearCardComponentFieldsAdapter(objects.objects);

            return criterias.map((item) => {
                if (allValues) {
                    this.index++;
                    let localIndex = this.index; // Muss gemacht werden, weil sonst this.index als referenz genommen wird. Hier muss aber ein eigener int vorhanden sein
                    let values = allValues[this.index].rating;

                    return (
                        <div className={"evaluation"}>
                            <h6>{item.name}</h6>

                            <CompareComponent
                                name={type + "-" + localIndex}
                                header={PortEvaluation.header}
                                fields={adapter}
                                values={values}
                                disabled={this.props.disabled}
                                onChanged={(values) => {
                                    this.valuesChanged(values, localIndex);
                                }}
                            />
                        </div>
                    );
                }
                return <></>;
            });
        }
        return [];
    }

    desktop(): JSX.Element {
        return (
            <>
                <h6 className={"compare-header"}>Marktattraktivität</h6>
                {this.getCompareComponents("attractivity")}

                <h6 className={"compare-header"}>Wettbewerbsposition</h6>
                {this.getCompareComponents("comp-standing")}
            </>
        );
    }

    mobile(): JSX.Element {
        return (
            <>
                <Accordion defaultActiveKey={"attractivity"}>
                    <Accordion.Item eventKey={"attractivity"}>
                        <Accordion.Header>Marktattraktivität</Accordion.Header>
                        <Accordion.Body>{this.getCompareComponents("attractivity")}</Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={"comp-standing"}>
                        <Accordion.Header>Wettbewerbsposition</Accordion.Header>
                        <Accordion.Body>{this.getCompareComponents("comp-standing")}</Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </>
        );
    }

    valuesChanged = (values: CompareComponentValues, index: number) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-evaluation"] !== undefined) {
                save.data["port-evaluation"].evaluation[index].rating = values;
            }
        });
    }

}

export {
    PortEvaluationComponent
}
export type {
    PortEvaluationValues
}