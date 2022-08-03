import {CardComponentField, CardComponentFields} from "../../CardComponent/CardComponent";
import {CompareComponentValues} from "../../CompareComponent/CompareComponent";
import {MatchCardComponentFieldsAdapter} from "../../CompareComponent/Adapter/MatchCardComponentFieldsAdapter";


/**
 * Stellt ein einzelnes Result dar
 */
interface SingleResult {
    /**
     * Das CardComponentField
     */
    criteria: CardComponentField,
    /**
     * Die Punkte des Felds
     */
    points: number,
    /**
     * Der Rang des Felds
     */
    rank: number
}

/**
 * Sind die Values der Evaluation
 */
export interface EvaluationValues {
    /**
     * Speichert die Werte der Evaluation als Array dar. Enthält alle Felder mit deren Punkten und Rang
     */
    result: SingleResult[]
    /**
     * Enthält das Ergebnis als Stringausgabe
     */
    resultAsString: string
}

/**
 * Kann benutzt werden, um ein
 */
class WeightingEvaluation<D = any> {
    private values: EvaluationValues = {
        result: [],
        resultAsString: ""
    };
    private readonly fields: CardComponentFields<D>;
    private readonly comparisons: CompareComponentValues;

    private sortedResult: SingleResult[];

    constructor(cardComponentFields: CardComponentFields<D>, compareComponentValues: CompareComponentValues) {
        this.fields = cardComponentFields;
        this.comparisons = compareComponentValues;

        // build array
        let result: SingleResult[] = [];
        for (const field of this.fields) {
            result.push({
                criteria: field,
                points: 0,
                rank: 0
            });
        }
        this.values.result = result;
        this.sortedResult = Object.assign([], result);

        // evaluate
        this.eval();

        this.sortedResult = WeightingEvaluation.sort(this.sortedResult);
        this.evalRank();
        this.values.resultAsString = this.toString();
    }

    /**
     * Baut eine instanz von Evaluation mit den mitgegeben CardComponentFields und CompareComponentValues
     *
     * @param {CardComponentFields} cardComponentFields Die CardComponentFields
     * @param {CompareComponentValues} compareComponentValues Die CompareComponentValues
     * @returns {WeightingEvaluation} Instanz der Evaluation
     */
    public static from<D>(cardComponentFields: CardComponentFields<D>, compareComponentValues: CompareComponentValues): WeightingEvaluation<D> {
        return new WeightingEvaluation(cardComponentFields, compareComponentValues);
    }

    /**
     * Sortiert ein Array
     *
     * @param {any[]} unsorted
     * @returns {any[]}
     */
    public static sort(unsorted: any[]) {
        let sorted = unsorted.sort((a, b) => {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        });
        return sorted;
    }

    /**
     * Gibt die Werte zurück
     *
     * @returns {EvaluationValues}
     */
    public getValues(): EvaluationValues {
        return this.values;
    }

    /**
     * Wandelt das Ergebnis in eine Stringausgabe um
     * @returns {string}
     */
    public toString(): string {
        let resultString = "";
        let i = 0;
        let oldField = this.sortedResult[0];

        for (const field of this.sortedResult) {
            let name = field.criteria.name;

            if (i <= 0) {
                resultString += name;
            } else {
                if (oldField.points === field.points) { // equal
                    resultString += " = " + name;
                } else if (oldField.points > field.points) { // old > current
                    resultString += " > " + name;
                } else { // old < current
                    resultString += " < " + name;
                }
            }

            oldField = field;
            i++;
        }
        return resultString;
    }

    /**
     * Evaluiert die CardComponentFields und die CompareComponentFields und wertet diese Anhand eines Punktesystems aus
     */
    private eval() {
        let adapter = new MatchCardComponentFieldsAdapter(this.fields);
        let middle = this.determineMiddleOfHeader();

        let i = 0;
        for (const comparison of this.comparisons.comparisons) {
            let field = adapter.getEntry(i);
            let first = this.findField(field.first);
            let second = this.findField(field.second as string);

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
    }

    /**
     * Der Rang wird evaluiert und mit ermittelt
     * Vorraussetzung hierfür: Das Result-Array sollte sortiert sein, damit der Rang besser ermitelt werden kann
     * @private
     */
    private evalRank() {
        // rank
        let rank = 1;
        let i = 0;

        for (const field of this.values.result) {
            if (i > 0 && field.points < this.values.result[i - 1].points) {
                rank++;
            }
            field.rank = rank;
            i++;
        }
    }

    private findField = (field: string) => {
        for (const value of this.values.result) {
            if (value.criteria.name === field) {
                return value;
            }
        }
        return null;
    }

    private determineMiddleOfHeader(): number {
        return (this.comparisons.headers.length - 1) / 2
    }
}

export {
    WeightingEvaluation
};
export type {SingleResult};

