import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";

import './step.scss';
import {StepController} from "../StepComponent";

export interface StepProp<V> extends FormComponentProps, ToolSaveProps<V> {
    stepController: StepController
    currentSubStep: number
}

export abstract class Step<V, S> extends FormComponent<StepProp<V>, S> {
}
