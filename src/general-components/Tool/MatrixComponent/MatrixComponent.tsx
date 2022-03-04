import {Component} from "react";
import StepComponent from "../SteppableTool/StepComponent/StepComponent";
import {Tool} from "../Tool";

import "./matrix-component.scss";


export interface MatrixComponentProps<D extends object> {
    tool: Tool<D>
    data: D
}

// TODO rename
class MatrixComponent<D extends Object, S> extends Component<MatrixComponentProps<D>, S> {

    protected getData = () => {
        return this.props.data;
    }

    protected getTool = () => {
        return this.props.tool;
    }

}

export {
    MatrixComponent
}
