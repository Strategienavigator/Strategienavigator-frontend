import {Component} from "react";
import StepComponent from "../SteppableTool/StepComponent/StepComponent";
import {Tool} from "../Tool";

import "./matrix-component.scss";


export interface MatrixComponentProps<D> {
    steps: Array<number>
    tool?: Tool<D>
    stepComponent?: StepComponent<D>
    data?: D
}

// TODO rename
class MatrixComponent<D,S> extends Component<MatrixComponentProps<D>, S> {

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
