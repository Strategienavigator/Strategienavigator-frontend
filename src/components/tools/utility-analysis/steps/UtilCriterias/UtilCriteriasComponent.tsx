import {FormComponentProps} from "../../../../../general-components/Tool/FormComponent/FormComponent";
import React from "react";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {UACriteriaCustomDescription, UACriteriaCustomDescriptionValues} from "./UACriteriaCustomDescription";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilCriterias} from "./UtilCriterias";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";


export interface UtilCriteriasValues {
    criterias: CardComponentFields<UACriteriaCustomDescriptionValues>
}


/**
 * Schritt der Nutzweranalyse in dem die Kriterien festgelegt werden
 */
class UtilCriteriasComponent extends Step<UtilityAnalysisValues, {}> {

    public constructor(props: (FormComponentProps & StepProp<UtilityAnalysisValues>) | Readonly<FormComponentProps & StepProp<UtilityAnalysisValues>>) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        let shouldUpdate = !shallowCompareStepProps(this.props, nextProps);
        if (!shouldUpdate) {
            shouldUpdate = this.props.save.data["ua-criterias"] !== nextProps.save.data["ua-criterias"];
        }
        return shouldUpdate;
    }

    build(): JSX.Element {
        const criterias = this.props.save.data["ua-criterias"]?.criterias;
        if (criterias !== undefined) {
            return (
                <>
                    <CardComponent<UACriteriaCustomDescriptionValues>
                        customDescriptions={[UACriteriaCustomDescription]}
                        values={criterias}
                        name={"util-criterias"}
                        disabled={this.props.disabled}
                        min={UtilCriterias.min}
                        max={UtilCriterias.max}
                        onChanged={this.valuesChanged}
                        customDescValuesFactory={UtilCriterias.getDefaultExtraData}
                    />
                    <UIErrorBanner id={"criterias.too-long"}/>
                    <UIErrorBanner id={"criterias.empty"}/>
                </>
            );
        }

        return <p>ERROR</p>;

    }

    valuesChanged = (values: CardComponentFields<UACriteriaCustomDescriptionValues>) => {
        this.props.saveController.onChanged(save => {
            if (save.data["ua-criterias"] !== undefined) {
                save.data["ua-criterias"].criterias = values;
            }
        });
    }

}

export {
    UtilCriteriasComponent
};
