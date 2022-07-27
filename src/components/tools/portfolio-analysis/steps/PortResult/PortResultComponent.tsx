import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {CoordinateSystem} from "../../../../../general-components/CoordinateSystem/CoordinateSystem";
import {NumberValueRenderer} from "../../../../../general-components/CoordinateSystem/ValueRenderer/NumberValueRenderer";
import {BCGCustomGrid} from "../../../../../general-components/CoordinateSystem/Grid/BCG/BCGCustomGrid";
import {Point} from "../../../../../general-components/CoordinateSystem/Point";
import {ResultEvaluationValue} from "../../../../../general-components/EvaluationComponent/Result/ResultEvaluation";
import {ResultEvaluationComponent} from "../../../../../general-components/EvaluationComponent/Result/ResultEvaluationComponent";
import {Accordion} from "react-bootstrap";


interface PortResultValues {
    results: {
        attractivity: ResultEvaluationValue,
        "comp-standing": ResultEvaluationValue
    },
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

    build(): JSX.Element {
        if (this.props.save.data["port-result"] !== undefined) {
            return (
                <>
                    <CoordinateSystem
                        maxWidth={700}
                        axisThickness={1}
                        axis={{
                            y: {
                                maxValue: 6,
                                name: "Marktattraktivität",
                                valueRenderer: new NumberValueRenderer(0),
                                valueAccuracy: 6
                            },
                            x: {
                                maxValue: 6,
                                name: "Wettbewerbsposition",
                                valueRenderer: new NumberValueRenderer(0),
                                valueAccuracy: 6
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
                        legend={true}
                        tooltipContentRenderer={(point) => {
                            return (
                                <>
                                    <strong>{point.header}</strong><br/>

                                    Marktattraktivität: {point.y.toFixed(2)} <br/>
                                    Wettbewerbsposition: {point.x.toFixed(2)}
                                </>
                            );
                        }}
                    />

                    <Accordion alwaysOpen className={"tables"}>
                        <Accordion.Item eventKey={"attractivity"}>
                            <Accordion.Header>
                                Marktattraktivität
                            </Accordion.Header>
                            <Accordion.Body>
                                <ResultEvaluationComponent
                                    values={this.props.save.data["port-result"].results.attractivity}/>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={"standing"}>
                            <Accordion.Header>
                                Wettbewerbsposition
                            </Accordion.Header>
                            <Accordion.Body>
                                <ResultEvaluationComponent
                                    values={this.props.save.data["port-result"].results["comp-standing"]}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </>
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