import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CompareComponent, CompareValue} from "../../../../../general-components/CompareComponent/CompareComponent";
import {
    MatchCardComponentFieldsAdapter
} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilWeighting} from "./UtilWeighting";


export interface UtilWeightingValues {
    comparisons: CompareValue[]
}


/**
 * Schritt der Nutzwertanalyse zum Gewichten der Kriterien
 */
class UtilWeightingComponent extends Step<UtilityAnalysisValues, {}> {


    public constructor(props: Readonly<StepProp<UtilityAnalysisValues>> | StepProp<UtilityAnalysisValues>, context: any) {
        super(props, context);
    }


    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) =>
                oldData["ua-weighting"] === newData["ua-weighting"] &&
                oldData["ua-criterias"] === newData["ua-criterias"]
        );
    }

    build(): JSX.Element {
        const values = this.props.save.data["ua-weighting"];
        const criterias = this.props.save.data["ua-criterias"]?.criterias;

        if (values !== undefined && criterias !== undefined) {
            const adapter = new MatchCardComponentFieldsAdapter(criterias);

            return (
                <CompareComponent
                    disabled={this.props.disabled}
                    values={values.comparisons}
                    showHeader={true}
                    fields={adapter}
                    header={UtilWeighting.header}
                    onChanged={this.valuesChanged}/>
            );
        }
        return <></>;
    }

    private valuesChanged = (values: CompareValue[]) => {
        this.props.saveController.onChanged(save => {
            if (save.data["ua-weighting"]) {
                save.data["ua-weighting"].comparisons = values;
            }
        });
    };
}

export {
    UtilWeightingComponent
};
