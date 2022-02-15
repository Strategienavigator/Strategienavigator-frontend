import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";

import './step.scss';
import {StepController} from "../StepComponent";
import {compareWithoutFunctions} from "../../../../ComponentUtils";

interface StepProp<V extends object> extends FormComponentProps, ToolSaveProps<V> {
    stepController: StepController
    currentSubStep: number
}

abstract class Step<V extends object, S> extends FormComponent<StepProp<V>, S> {


    protected constructor(props: Readonly<StepProp<V>> | StepProp<V>);
    protected constructor(props: StepProp<V>, context: any);
    protected constructor(props: Readonly<StepProp<V>> | StepProp<V>, context?: any) {
        super(props, context);
    }
}

const shallowCompareStepProps = (oldProps: StepProp<any>, newProps: StepProp<any>): boolean => {
    return compareWithoutFunctions(oldProps,newProps,["save"]);
}

export type {
    StepProp

}

export {
    Step,
    shallowCompareStepProps
}

