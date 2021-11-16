import {Component} from "react";
import StepComponent from "../SteppableTool/StepComponent/StepComponent";
import {Tool} from "../Tool";

import "./matrix-component.scss";


export interface MatrixComponentProps {
    steps: Array<number>
    tool?: Tool
    stepComponent?: StepComponent
    data?: object
}

class MatrixComponent<S> extends Component<MatrixComponentProps, S> {

    protected getSteps = () => {
        return this.props.steps;
    }

    protected getData = () => {
        return this.props.data;
    }

    protected getTool = () => {
        return this.props.tool;
    }

    protected getStepComponent = () => {
        return this.props.stepComponent;
    }

}

export {
    MatrixComponent
}
