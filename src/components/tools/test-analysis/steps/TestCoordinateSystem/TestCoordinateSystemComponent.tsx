import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";
import {CoordinateSystem} from "../../../../../general-components/CoordinateSystem/CoordinateSystem";
import {Point} from "../../../../../general-components/CoordinateSystem/Point/Point";
import {Button} from "react-bootstrap";
import {ButtonPanel} from "../../../../../general-components/ButtonPanel/ButtonPanel";
import {PointComponent} from "../../../../../general-components/CoordinateSystem/Point/PointComponent";

export interface TestCoordinateSystemValues {
    points: Point[]
}

interface TestCoordinateSystemComponentState {
}

class TestCoordinateSystemComponent extends Step<TestAnalysisValues, TestCoordinateSystemComponentState> {

    public constructor(props: StepProp<TestAnalysisValues> | Readonly<StepProp<TestAnalysisValues>>) {
        super(props);
    }

    public static randomNumberInRange = (min: number, max: number) => {
        return Math.floor(Math.random()
            * (max - min + 1)) + min;
    };

    protected build(): JSX.Element {
        let points = this.props.save.data["test-coordinate-system"]?.points;

        if (points) {
            return (
                <>
                    <CoordinateSystem
                        axis={{
                            y: {
                                name: "Y-Achse",
                                maxValue: "auto",
                                valueAccuracy: "auto"
                            },
                            x: {
                                name: "X-Achse",
                                maxValue: "auto",
                                valueAccuracy: "auto"
                            }
                        }}
                        points={points}
                        heightRange={{
                            start: 0,
                            end: 10
                        }}
                        widthRange={{
                            start: 0,
                            end: 10
                        }}
                    />

                    <PointComponent
                        points={points}
                        customHeader={"CustomHeader"}
                        axisHeader={{
                            y: "Epsilon",
                            x: "Ex"
                        }}
                        displayColor={true}
                    />

                    <ButtonPanel>
                        <Button
                            disabled={this.props.disabled}
                            onClick={this.addPoint}
                        >
                            Punkt hinzufügen
                        </Button>

                        <Button
                            disabled={this.props.disabled}
                            onClick={this.clearPoints}
                        >
                            Punkte entfernen
                        </Button>
                    </ButtonPanel>
                </>
            );
        } else {
            return <></>;
        }
    }

    private addPoint = () => {
        this.props.saveController.onChanged(save => {
            if (save.data["test-coordinate-system"]) {
                let points = save.data["test-coordinate-system"].points;
                points.push(new Point(
                    TestCoordinateSystemComponent.randomNumberInRange(0, 10),
                    TestCoordinateSystemComponent.randomNumberInRange(0, 10),
                    "Testpunkt" + (points.length + 1),
                    1));
                save.data["test-coordinate-system"].points = points;
            }
        });
    }

    private clearPoints = () => {
        this.props.saveController.onChanged(save => {
            if (save.data["test-coordinate-system"]) {
                save.data["test-coordinate-system"].points = [];
            }
        });
    }
}

export {
    TestCoordinateSystemComponent
}