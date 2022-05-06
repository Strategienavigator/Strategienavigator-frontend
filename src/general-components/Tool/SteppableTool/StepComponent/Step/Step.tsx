import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";

import './step.scss';
import {StepController} from "../StepComponent";
import {compareWithoutFunctions} from "../../../../ComponentUtils";


interface StepProp<V extends object> extends FormComponentProps, ToolSaveProps<V> {
    stepController: StepController
    currentSubStep: number
    validationFailed: boolean
}

abstract class Step<V extends object, S> extends FormComponent<StepProp<V>, S> {
    protected constructor(props: Readonly<StepProp<V>> | StepProp<V>);
    protected constructor(props: StepProp<V>, context: any);
    protected constructor(props: Readonly<StepProp<V>> | StepProp<V>, context?: any) {
        super(props, context);
    }
}


/**
 * prüft ob die alten und die neuen Props identisch sind. alle außer der save prop und funktionen werden verglichen.
 * @param oldProps alten props
 * @param newProps neuen props
 * @param toIgnore welche props beim vergleich vernachlässigt werden sollen
 * @param dataComparison ein callback um die Daten des speicherstandes zu vergleichen, wenn dieser true returned wird davon ausgegeangen, das die daten auch gleich sind
 */
const shallowCompareStepProps = <T extends object>(oldProps: StepProp<T>, newProps: StepProp<T>, dataComparison?: (oldData: T, newData: T) => boolean, toIgnore: (keyof StepProp<T>)[] = []): boolean => {
    let isSame = compareWithoutFunctions(oldProps, newProps, ["save", ...toIgnore.map(k => k.toString())]);

    if (isSame && dataComparison !== undefined) {
        isSame = dataComparison(oldProps.save.data, newProps.save.data);
    }

    return isSame;
}

export type {
    StepProp

}

export {
    Step,
    shallowCompareStepProps
}

