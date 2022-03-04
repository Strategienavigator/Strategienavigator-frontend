import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {PCPairComparisonComponent} from "./PCPairComparisonComponent";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {CompareNumberHeader} from "../../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {
    MatchCardComponentFieldsAdapter
} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {CompareValue} from "../../../../../general-components/CompareComponent/CompareComponent";


class PCPairComparison implements StepDefinition<PairwiseComparisonValues>, StepDataHandler<PairwiseComparisonValues> {

    public static header = new CompareNumberHeader(0, 3);


    dataHandler: StepDataHandler<PairwiseComparisonValues>;
    form: React.FunctionComponent<StepProp<PairwiseComparisonValues>> | React.ComponentClass<StepProp<PairwiseComparisonValues>>;
    title: string;
    id: string;


    constructor() {
        this.title = "2. Paarvergleich";
        this.id = "pc-comparison";
        this.form = PCPairComparisonComponent;
        this.dataHandler = this;

    }

    deleteData(data: Draft<PairwiseComparisonValues>): void {
        data["pc-comparison"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PairwiseComparisonValues>): void {
        const criterias = data["pc-criterias"]?.criterias;
        if (criterias !== undefined) {
            const comparisons: Array<CompareValue> = [];
            const adapter = new MatchCardComponentFieldsAdapter(criterias);
            for (let i = 0; i < adapter.getLength(); i++) {
                comparisons.push({header: null, value: null});
            }
            data["pc-comparison"] = {
                comparisons: comparisons,
                headers: PCPairComparison.header.getHeaders()
            };
        }
    }

    isUnlocked(data: PairwiseComparisonValues): boolean {
        return data["pc-comparison"] !== undefined && Object.keys(data["pc-comparison"]).length > 0;
    }


    validateData(data: PairwiseComparisonValues): UIError[] {
        const comparisons = data["pc-comparison"]?.comparisons;
        const errors: UIError[] = [];
        if (comparisons === undefined) {
            errors.push({
                id: "pairwise-comparisons.comparison.missing",
                level: "error",
                message: "Daten fehlen"
            });
        } else {
            for (const comparison of comparisons) {
                if (comparison.value === null) {
                    errors.push({
                        "id": "pairwise-comparisons.comparison.not-filled",
                        level: "error",
                        message: "Fülle alle Vergleiche aus"
                    });
                    break;
                }
            }
        }

        return errors;
    }

}

export {
    PCPairComparison
}
