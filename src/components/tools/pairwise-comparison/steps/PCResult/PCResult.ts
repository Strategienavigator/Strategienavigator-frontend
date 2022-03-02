import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PCResultComponent, PointCriteria} from "./PCResultComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {
    MatchCardComponentFieldsAdapter
} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";

class PCResult implements StepDefinition<PairwiseComparisonValues>, StepDataHandler<PairwiseComparisonValues> {
    dataHandler: StepDataHandler<PairwiseComparisonValues>;
    form: React.FunctionComponent<StepProp<PairwiseComparisonValues>> | React.ComponentClass<StepProp<PairwiseComparisonValues>>;
    id: string;
    title: string;


    constructor() {
        this.title = "3. Ergebnis";
        this.id = "pc-result";
        this.form = PCResultComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<PairwiseComparisonValues>): void {
        data["pc-result"] = undefined;
    }

    /**
     * Erstellen der Rangliste der Kriterien basierend auf einem Punktesystem
     *
     *
     */
    fillFromPreviousValues(data: Draft<PairwiseComparisonValues>): void {
        let criterias = data["pc-criterias"]?.criterias;
        let comparisons = data["pc-comparison"];

        if (comparisons && criterias && comparisons.comparisons) {
            let adapter = new MatchCardComponentFieldsAdapter(criterias);

            // build array
            let result: PointCriteria[] = [];
            for (const criteria of criterias) {
                result.push({
                    criteria: criteria,
                    points: 0,
                    rank: 0
                });
            }

            const findElement = (element: string) => {
                for (const criteria of result) {
                    if (criteria.criteria.name === element) {
                        return criteria;
                    }
                }
                return null;
            }

            let middle = (comparisons.headers.length - 1) / 2;

            let i = 0;
            for (const comparison of comparisons.comparisons) {
                let criteria = adapter.getEntry(i);
                let first = findElement(criteria.first);
                let second = findElement(criteria.second as string);

                if (comparison.value !== null && first !== null && second !== null) {
                    let value = parseInt(comparison.value);

                    if (value === middle) { // first = second
                        first.points += 1;
                        second.points += 1;
                    } else if (value > middle) { // second > first
                        second.points += 2;
                    } else { // first > second
                        first.points += 2;
                    }
                }

                i++;
            }

            // sort
            result = result.sort((a, b) => {
                if (a.points > b.points) {
                    return -1;
                }
                if (a.points < b.points) {
                    return 1;
                }
                return 0;
            })

            // rank
            let rank = 1;
            i = 0;

            for (const criteria of result) {
                if (i > 0 && criteria.points < result[i - 1].points) {
                    rank++;
                }
                criteria.rank = rank;
                i++;
            }

            // finish up
            data["pc-result"] = {
                result: result,
                resultAsString: PCResult.buildString(result)
            };
        }
    }

    /**
     * Methode zum Generieren des Ergebnis-Strings
     *
     * @param {PointCriteria[]} result
     * @returns {string}
     */
    static buildString(result: PointCriteria[]): string {
        let resultString = "";
        let i = 0;
        let oldCriteria = result[0];

        for (const criteria of result) {
            let name = criteria.criteria.name;

            if (i <= 0) {
                resultString += name;
            } else {
                if (oldCriteria.points === criteria.points) { // equal
                    resultString += " = " + name;
                } else if (oldCriteria.points > criteria.points) { // old > current
                    resultString += " > " + name;
                } else { // old < current
                    resultString += " < " + name;
                }
            }

            oldCriteria = criteria;
            i++;
        }
        return resultString;
    }


    isUnlocked(data: PairwiseComparisonValues): boolean {
        return data["pc-result"] !== undefined && Object.keys(data["pc-result"]).length > 0;
    }


    validateData(data: PairwiseComparisonValues): UIError[] {
        return [];
    }

}

export {
    PCResult
}
