import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PCPairComparisonValues} from "./PCPairComparison";
import {FormEvent} from "react";
import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "./PCCriterias";
import {CardComponentField} from "../../../../general-components/CardComponent/CardComponent";


interface PointCriteria {
    criteria: CardComponentField
    points: number
}

export interface PCResultValues {
    result: PointCriteria[]
    resultAsString: string
}


class PCResult extends Step<PCResultValues, {}> {

    build(): JSX.Element {
        let values = this.values as PCResultValues;

        return (
            <div>
                <b>Ergebnis:</b><br />
                {values.resultAsString}
            </div>
        );
    }

    eval() {
        let criterias = this.getStepComponent()?.getFormValues<PCCriteriasValues>("pc-criterias");
        let comparisons = this.getStepComponent()?.getFormValues<PCPairComparisonValues>("pc-comparison");

        if (comparisons && criterias && criterias.criterias && comparisons.comparisons) {
            let adapter = new MatchCardComponentFieldsAdapter(criterias.criterias);

            // build array
            let result: PointCriteria[] = [];
            for (const criteria of criterias.criterias) {
                result.push({
                    criteria: criteria,
                    points: 0
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

            // finish up
            this.values = {
                result: result,
                resultAsString: this.buildString(result)
            }
        }
    }

    buildString(result: PointCriteria[]): string {
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

    async buildPreviousValues(): Promise<void> {
        this.eval();
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCResultValues {
        this.eval();
        return this.values as PCResultValues;
    }

    onReset(type: ResetType): void {
    }

    async rebuildValues(values: PCResultValues): Promise<void> {
        this.eval();
    }

    async submit(values: PCResultValues): Promise<void> {

    }

    validate(values: PCResultValues): boolean {
        return true;
    }

}

export {
    PCResult
}