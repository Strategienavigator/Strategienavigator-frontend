import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import React from "react";


/**
 * Die Werte des ersten Schrittes des Paarweisen-Vergleiches
 */
interface PCCriteriasValues {
    criterias: CardComponentFields
}

interface PCCriteriasState {

}

/**
 * Baut den ersten Schritt des Paarweisen-Vergleiches
 * hier werden, mithilfe des CardComponents, Kriterien angesammelt
 */
export class PCCriteriasComponent extends Step<PairwiseComparisonValues, PCCriteriasState> {


    public constructor(props: Readonly<StepProp<PairwiseComparisonValues>> | StepProp<PairwiseComparisonValues>, context: any) {
        super(props, context);
    }


    shouldComponentUpdate(nextProps: Readonly<StepProp<PairwiseComparisonValues>>, nextState: Readonly<PCCriteriasState>, nextContext: any): boolean {
        let shouldUpdate: boolean = !shallowCompareStepProps(this.props, nextProps);

        if (!shouldUpdate) {
            shouldUpdate = this.props.save.data["pc-criterias"] !== nextProps.save.data["pc-criterias"];
        }

        return shouldUpdate;
    }

    /**
     * Gibt ein CardComponent aus um die Kriterien anzusammeln
     *
     * @returns {JSX.Element} CardComponent
     */
    build(): JSX.Element {
        let values = this.props.save.data["pc-criterias"];
        if (values !== undefined) {
            return (
                <>
                    <CardComponent
                        name={"criterias"}
                        disabled={this.props.disabled}
                        values={values.criterias}
                        min={2}
                        max={10}
                        onChanged={this.cardComponentChanged}
                    />
                    <UIErrorBanner id={"pairwise-comparison.criterias"}/>
                    <UIErrorBanner id={"pairwise-comparison.criterias-too-long"}/>
                    <UIErrorBanner id={"pairwise-comparison.criterias-empty"}/>
                </>
            );
        }

        return <p>ERROR</p>;
    }

    private cardComponentChanged = (fields: CardComponentFields) => {
        this.props.saveController.onChanged(save => {
            if (save.data["pc-criterias"] === undefined) {
                save.data["pc-criterias"] = {criterias: []};
            }
            save.data["pc-criterias"].criterias = fields;
        });
    }

}

export type {
    PCCriteriasValues
}
