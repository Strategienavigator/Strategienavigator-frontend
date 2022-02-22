import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CompareComponent, CompareValue} from "../../../../../general-components/CompareComponent/CompareComponent";
import {
    MatchCardComponentFieldsAdapter
} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {PCPairComparison} from "./PCPairComparison";


/**
 * Die Werte des zweiten Schrittes des Paarweisen-Vergleiches
 */
export interface PCPairComparisonValues {
    comparisons: CompareValue[],
    headers: string[]
}

/**
 * Stellt den zweiten Schritt des Paarweisen-Vergleichs dar
 */
class PCPairComparisonComponent extends Step<PairwiseComparisonValues, {}> {

    public constructor(props: Readonly<StepProp<PairwiseComparisonValues>> | StepProp<PairwiseComparisonValues>, context: any) {
        super(props, context);
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
                    values={comparisonValues.comparisons}
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

    private comparisonsChanged = (values: CompareValue[]) => {
        this.props.saveController.onChanged(save => {
            if (save.data["pc-comparison"] !== undefined) {
                save.data["pc-comparison"].comparisons = values;
            }
        });
    }
}

export {
    PCPairComparisonComponent
}
