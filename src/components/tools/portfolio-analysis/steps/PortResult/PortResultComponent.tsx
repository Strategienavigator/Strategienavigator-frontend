import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {CoordinateSystem} from "../../../../../general-components/CoordinateSystem/CoordinateSystem";
import {NumberValueRenderer} from "../../../../../general-components/CoordinateSystem/ValueRenderer/NumberValueRenderer";
import {PercantageValueRenderer} from "../../../../../general-components/CoordinateSystem/ValueRenderer/PercantageValueRenderer";
import {BCGCustomGrid} from "../../../../../general-components/CoordinateSystem/Grid/BCG/BCGCustomGrid";
import {Point} from "../../../../../general-components/CoordinateSystem/Point";
import {Evaluation} from "../../../../../general-components/EvaluationComponent/Evaluation";


interface PortResultValues {
    results: {},
    points: Point[]
}

class PortResultComponent extends Step<PortfolioAnalysisValues, {}> {

    public constructor(props: StepProp<PortfolioAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PortfolioAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps, (oldData, newData) => {
            return oldData["port-result"] === newData["port-result"];
        });
    }

    berechne = () => {
        let data = this.props.save.data;

        if (data["port-criterias"] !== undefined && data["port-evaluation"] !== undefined) {
            let criterias = data["port-criterias"].attractivity;
            let evaluation1 = data["port-evaluation"].attractivity[0];

            console.log(criterias, evaluation1);

            let evaluation = Evaluation.from(criterias, evaluation1);

            console.log(evaluation);
            console.log(evaluation.getValues());
        }
    }

    build(): JSX.Element {
        this.berechne();

        if (this.props.save.data["port-result"] !== undefined) {
            return (
                <CoordinateSystem
                    maxWidth={700}
                    axisThickness={1}
                    axis={{
                        y: {
                            maxValue: 12,
                            name: "Marktwachstum",
                            valueRenderer: new PercantageValueRenderer(0),
                            valueAccuracy: 12
                        },
                        x: {
                            maxValue: 2.2,
                            name: "Relativer Marktanteil",
                            valueRenderer: new NumberValueRenderer(1),
                            valueAccuracy: 11
                        }
                    }}
                    points={this.props.save.data["port-result"].points}
                    gridDisplay={new BCGCustomGrid()}
                    widthRange={{
                        start: 0,
                        end: 10
                    }}
                    heightRange={{
                        start: 0,
                        end: 10
                    }}
                />
            );
        }
        return <></>;
    }

}

export {
    PortResultComponent
}
export type {
    PortResultValues
}