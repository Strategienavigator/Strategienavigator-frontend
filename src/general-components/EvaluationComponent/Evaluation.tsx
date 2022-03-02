import {CardComponentField, CardComponentFields} from "../CardComponent/CardComponent";
import {CompareComponentValues} from "../CompareComponent/CompareComponent";
import {MatchCardComponentFieldsAdapter} from "../CompareComponent/Adapter/MatchCardComponentFieldsAdapter";


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
class Evaluation {
    private values: EvaluationValues = {
        result: [],
        resultAsString: ""
    };
    private readonly fields: CardComponentFields;
    private readonly comparisons: CompareComponentValues;

    constructor(cardComponentFields: CardComponentFields, compareComponentValues: CompareComponentValues) {
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

        this.eval();
        this.sortResult();
        this.evalRank();
        this.values.resultAsString = this.toString();
    }

    public static from(cardComponentFields: CardComponentFields, compareComponentValues: CompareComponentValues): Evaluation {
        return new Evaluation(cardComponentFields, compareComponentValues);
    }

    public eval() {
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

    public getValues(): EvaluationValues {
        return this.values;
    }

    public toString(): string {
        let resultString = "";
        let i = 0;
        let oldField = this.values.result[0];

        for (const field of this.values.result) {
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
        let headers: string[] = [];
        for (let i = 0; i < this.comparisons.comparisons.length; i++) {
            let comparison = this.comparisons.comparisons[i];
            let header = comparison.header;
            if (header) {
                headers.push(header);
            }
        }
        let uniqueHeaders = headers.filter(function (item, pos, self) {
            return self.indexOf(item) === pos;
        })
        return (uniqueHeaders.length - 1) / 2;
    }

    private sortResult() {
        this.values.result = this.values.result.sort((a, b) => {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        })
    }

}

export {
    Evaluation
};
export type {SingleResult};

