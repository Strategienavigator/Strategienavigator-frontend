import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";

import './step.scss';

export interface StepProp<V> extends FormComponentProps, ToolSaveProps<V>{

}

export abstract class Step<V, S> extends FormComponent<StepProp<V>,S>{

}
