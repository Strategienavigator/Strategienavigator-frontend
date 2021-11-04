import {FormComponent, FormComponentProps} from "../../../FormComponent/FormComponent";
import StepComponent from "../StepComponent";

export interface SteppableProp extends FormComponentProps{
    stepComp?: StepComponent
}

export abstract class Step<V, S> extends FormComponent<V, SteppableProp,S>{

    protected getStepComponent(){
        return this.props.stepComp;
    }

    protected requireStepComponent(){
        if(this.props.stepComp){
            return this.props.stepComp as StepComponent;
        }else{
            throw new Error("No STep Component Set");
        }
    }

}
