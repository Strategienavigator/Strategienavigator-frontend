import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PCPairComparisonValues} from "./PCPairComparison";
import {FormEvent} from "react";
import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "./PCCriterias";
import {CardComponentField} from "../../../../general-components/CardComponent/CardComponent";
import {Table} from "react-bootstrap";


interface PointCriteria {
    criteria: CardComponentField
    points: number,
    rank: number
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
                <div style={{marginBottom: "1.5rem"}}>
                    <b>Ergebnis:</b><br />
                    {values.resultAsString}
                </div>

                <Table className={"resultTable"} bordered={false} borderless={false} hover={true} variant={"light"} striped={true}>
                    <thead>
                        <tr>
                            <th>Kriterium</th>
                            <th className={"fixed"}>Punkte</th>
                            <th className={"fixed"}>Rang</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.result && values.result.map((v) => {
                            return (
                                <tr>
                                    <td>
                                        {v.criteria.name}<br/>
                                        <small>{v.criteria.desc}</small>
                                    </td>
                                    <td className={"fixed"}>{v.points}</td>
                                    <td className={"fixed"}>{v.rank}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }


    /**
     * Erstellen der Rangliste der Kriterien basierend auf einem Punktesystem
     *
     *
     */
    eval() {
        let criterias = this.requireStepComponent().getFormValues<PCCriteriasValues>("pc-criterias");
        let comparisons = this.requireStepComponent().getFormValues<PCPairComparisonValues>("pc-comparison");

        if (comparisons && criterias && criterias.criterias && comparisons.comparisons) {
            let adapter = new MatchCardComponentFieldsAdapter(criterias.criterias);

            // build array
            let result: PointCriteria[] = [];
            for (const criteria of criterias.criterias) {
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
                if(i > 0 && criteria.points < result[i - 1].points) {
                    rank++;
                }
                criteria.rank = rank;
                i++;
            }

            // finish up
            this.values = {
                result: result,
                resultAsString: this.buildString(result)
            }
        }
    }


    /**
     * Methode zum Generieren des Ergebnis-Strings
     *
     * @param {PointCriteria[]} result
     * @returns {string}
     */
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
