import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";

import './step.scss';
import {StepController} from "../StepComponent";

export interface StepProp<V extends object> extends FormComponentProps, ToolSaveProps<V> {
    stepController: StepController
    currentSubStep: number
}

export abstract class Step<V extends object, S> extends FormComponent<StepProp<V>, S> {


    constructor(props: Readonly<StepProp<V>> | StepProp<V>);
    constructor(props: StepProp<V>, context: any);
    constructor(props: Readonly<StepProp<V>> | StepProp<V>, context?: any) {
        super(props, context);
    }
}
