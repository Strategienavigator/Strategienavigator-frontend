import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilInvestigationObjects} from "./UtilInvestigationObjects";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";


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


    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<any>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => oldData["ua-investigation-obj"] === newData["ua-investigation-obj"]
        );
    }

    build(): JSX.Element {
        let values = this.props.save.data["ua-investigation-obj"];

        if (values !== undefined) {
            return (
                <>
                    <CardComponent
                        values={values.objects}
                        name={"investigation-objects"}
                        disabled={this.props.disabled}
                        min={UtilInvestigationObjects.min}
                        max={UtilInvestigationObjects.max}
                        onChanged={this.valuesChanged}
                    />
                    <UIErrorBanner id={"investigation-objects.too-long"}/>
                    <UIErrorBanner id={"investigation-objects.empty"}/>
                </>
            );
        }

        return <p>ERROR</p>;
    }

    private valuesChanged = (fields: CardComponentFields) => {
        this.props.saveController.onChanged(save => {
            if (save.data["ua-investigation-obj"] !== undefined) {
                save.data["ua-investigation-obj"].objects = fields;
            }
        });
    };
}

export {
    UtilInvestigationObjectsComponent
};
