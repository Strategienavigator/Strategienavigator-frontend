import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import StepComponent from "../StepComponent";

import './step.scss';
import {FormEvent} from "react";
import {Messages} from "../../../../Messages/Messages";

export interface SteppableProp<D> extends FormComponentProps{
    stepComp?: StepComponent<D>
}

export abstract class Step<V, S> extends FormComponent<V, SteppableProp<V>,S>{

    protected getStepComponent(){
        return this.props.stepComp;
    }

    protected requireStepComponent(){
        if(this.props.stepComp){
            return this.props.stepComp as StepComponent<V>;
        }else{
            throw new Error("No Step Component Set");
        }
    }

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
