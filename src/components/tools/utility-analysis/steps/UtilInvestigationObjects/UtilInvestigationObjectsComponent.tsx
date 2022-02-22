import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilInvestigationObjects} from "./UtilInvestigationObjects";


export interface UtilInvestigationObjectsValues {
    objects: CardComponentFields
}


/**
 * Schritt der Nutzwertanalyse in dem die zu untersuchenden Objekte festgelegt werden
 */
class UtilInvestigationObjectsComponent extends Step<UtilityAnalysisValues, any> {


    public constructor(props: Readonly<StepProp<UtilityAnalysisValues>> | StepProp<UtilityAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let values = this.props.save.data["ua-investigation-obj"];

        if (values !== undefined) {
            return (
                <CardComponent
                    values={values.objects}
                    name={"investigation-objects"}
                    disabled={this.props.disabled}
                    min={UtilInvestigationObjects.min}
                    max={UtilInvestigationObjects.max}
                    onChanged={this.valuesChanged}/>
            );
        }

        return <p>ERROR</p>;
    }

    private valuesChanged = (fields: CardComponentFields) => {
        this.props.saveController.onChanged(save => {
            if(save.data["ua-investigation-obj"] !== undefined){
                save.data["ua-investigation-obj"].objects = fields;
            }
        });
    };
}

export {
    UtilInvestigationObjectsComponent
};
