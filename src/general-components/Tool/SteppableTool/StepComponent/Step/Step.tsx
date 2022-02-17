import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import StepComponent from "../StepComponent";

import './step.scss';
import {FormEvent} from "react";
import {Messages} from "../../../../Messages/Messages";

export interface SteppableProp extends FormComponentProps{
    /**
     * Das StepComponent
     */
    stepComp?: StepComponent
}

/**
 * Stellt einen einzelnen Schritt aus dem StepComponent dar.
 * Erbt dazu aus FormComponent.
 */
export abstract class Step<V, S> extends FormComponent<V, SteppableProp,S>{

    /**
     * Gibt das StepComponent zurück.
     * @returns {StepComponent} Das StepComponent
     * @throws {Error} Fehler, falls das StepComponent nicht gesetzt wurde: "No Step Component Set"
     * @protected
     */
    protected requireStepComponent() {
        if(this.props.stepComp) {
            return this.props.stepComp as StepComponent;
        } else {
            throw new Error("No Step Component Set");
        }
    }

    /**
     * Funktion wurde hier überschrieben, da der Formsubmit bei einem Step sich anders verhält als im FormComponent.
     *
     * @param {React.FormEvent<HTMLFormElement>} e Das HTML-Formular mit den Werten
     * @returns {Promise<void>}
     * @override
     */
    protected onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        let newValues = this.extractValues(e);
        this.values = newValues;

        if (this.isSaving) {
            this.isSaving = false;
        } else {
            // is nextstep
            if (this.validate(newValues)) {
                await this.submit(newValues);
                this.props.stepComp?.nextStep();
            } else {
                Messages.add(
                    "Bitte überprüfen Sie vorher Ihre Eingaben!",
                    "DANGER",
                    Messages.TIMER
                );
            }
        }
    }

}
