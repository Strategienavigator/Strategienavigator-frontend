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
import {UACriteriaCustomDescriptionValues} from "../../../utility-analysis/steps/UtilCriterias/UACriteriaCustomDescription";
import {UACriteriaCustomDescriptionInfoPanel} from "../../../utility-analysis/steps/UtilCriterias/ScaleDescriptionModal/UACriteriaCustomDescriptionInfoPanel";
import {WeightingEvaluation} from "../../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation";
import {ReactNode} from "react";


export interface Rating {
    criteriaIndex: number,
    rating: CompareComponentValues
}

interface PortEvaluationValues {
    "attractivity": Rating[]
    "comp-standing": Rating[]
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

                <UIErrorBanner id={"port-evaluation.empty"}/>
            </>
        );
    }

    getCompareComponents(type: "attractivity" | "comp-standing"): ReactNode[] {
        let allValues = this.props.save.data["port-evaluation"];
        let allCriterias = this.props.save.data["port-criterias"];
        let allWeighting = this.props.save.data["port-weighting"];
        let objects = this.props.save.data["port-objects"];
        let criterias: CardComponentFields<UACriteriaCustomDescriptionValues>;

        if (
            allCriterias &&
            allCriterias?.attractivity !== undefined &&
            allCriterias["comp-standing"] !== undefined &&
            allValues &&
            allValues.attractivity !== undefined &&
            allValues["comp-standing"] !== undefined &&
            allWeighting &&
            allWeighting["comp-standing"] !== undefined &&
            allWeighting.attractivity !== undefined &&
            objects !== undefined
        ) {
            let weighting : CompareComponentValues;
            let values : Rating[];
            if (type === "attractivity") {
                weighting = allWeighting.attractivity;
                values = allValues.attractivity;
                criterias = allCriterias?.attractivity;
            } else {
                weighting = allWeighting["comp-standing"];
                values = allValues["comp-standing"];
                criterias = allCriterias?.["comp-standing"];
            }
            let weightingEval = new WeightingEvaluation(criterias, weighting);
            let weightingValues = weightingEval.getValues();

            let adapter = new LinearCardComponentFieldsAdapter(objects.objects);

            return criterias.map((criteria, index) => {
                if (!weightingValues.result.some((item) => {
                    return item.criteria === criteria && item.points !== 0;
                })) {
                    return null;

                return (
                    <div key={"evaluation-" + index + "-" + type} className={"evaluation"}>
                        <h6>
                            {criteria.name}

                            {criteria.extra !== undefined && (
                                <UACriteriaCustomDescriptionInfoPanel
                                    values={criteria.extra}
                                />
                            )}
                        </h6>

                        <CompareComponent
                            name={type + "-" + index}
                            header={PortEvaluation.header}
                            disabledComparisons={criteria.extra?.activeIndices}
                            fields={adapter}
                            values={values[index].rating}
                            disabled={this.props.disabled}
                            onChanged={(values) => {
                                this.valuesChanged(values, index, type);
                            }}
                        />
                    </div>
                );
            })
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

    valuesChanged = (values: CompareComponentValues, index: number, type: "attractivity" | "comp-standing") => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-evaluation"] !== undefined) {
                if (type === "attractivity") {
                    save.data["port-evaluation"].attractivity[index].rating = values;
                } else {
                    save.data["port-evaluation"]["comp-standing"][index].rating = values;
                }
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
