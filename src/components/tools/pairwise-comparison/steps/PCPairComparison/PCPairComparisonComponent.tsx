import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {
    CompareComponent,
    CompareComponentValues
} from "../../../../../general-components/CompareComponent/CompareComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {PCPairComparison} from "./PCPairComparison";


/**
 * Die Werte des zweiten Schrittes des Paarweisen-Vergleiches
 */
export interface PCPairComparisonValues extends CompareComponentValues {}

/**
 * Stellt den zweiten Schritt des Paarweisen-Vergleichs dar
 */
class PCPairComparisonComponent extends Step<PairwiseComparisonValues, {}> {

    public constructor(props: Readonly<StepProp<PairwiseComparisonValues>> | StepProp<PairwiseComparisonValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PairwiseComparisonValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        let shouldUpdate = !shallowCompareStepProps(this.props, nextProps);

        if (!shouldUpdate) {
            shouldUpdate =
                this.props.save.data["pc-criterias"] !== nextProps.save.data["pc-criterias"] ||
                this.props.save.data["pc-comparison"] !== nextProps.save.data["pc-comparison"];
        }
        return shouldUpdate;
    }

    /**
     * Baut die Ausgabe für den zweiten Schritt.
     * Gibt ein CompareComponent zurück
     *
     * @returns {JSX.Element} CompareComponent
     */
    build() {
        const comparisonValues = this.props.save.data["pc-comparison"];
        const criteriaValues = this.props.save.data["pc-criterias"]?.criterias;

        if (comparisonValues !== undefined && criteriaValues !== undefined) {
            // TODO remove adapter
            const adapter = new MatchCardComponentFieldsAdapter(criteriaValues);

            return (
                <CompareComponent
                    values={comparisonValues}
                    showHeader={true}
                    disabled={this.props.disabled}
                    fields={adapter}
                    header={PCPairComparison.header}
                    onChanged={this.comparisonsChanged}
                />
            );
        }

        return <p>ERROR</p>;
    }

    private comparisonsChanged = (values: CompareComponentValues) => {
        this.props.saveController.onChanged(save => {
            if (save.data["pc-comparison"] !== undefined) {
                save.data["pc-comparison"] = values;
            }
        });
    }
}

export {
    PCPairComparisonComponent
}
