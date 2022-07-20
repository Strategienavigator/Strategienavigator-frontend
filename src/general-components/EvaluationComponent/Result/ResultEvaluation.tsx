import {CardComponentField, CardComponentFields} from "../../CardComponent/CardComponent";
import {CompareComponentValues} from "../../CompareComponent/CompareComponent";
import {WeightingEvaluation} from "../Weighting/WeightingEvaluation";
import {CompareHeaderAdapter} from "../../CompareComponent/Header/CompareHeaderAdapter";


export interface ResultEvaluationResult {
    object: CardComponentField,
    points: number,
    rank: number
}

export interface ResultEvaluationPercentages {
    criteria: CardComponentField,
    points: number,
    percentage: number
}

export interface ResultEvaluationValue {
    result: ResultEvaluationResult[],
    percentages: ResultEvaluationPercentages[]
}

class ResultEvaluation {
    private readonly criterias: CardComponentFields;
    private readonly objects: CardComponentFields;
    private readonly weighting: CompareComponentValues;
    private readonly evaluation: CompareComponentValues[];
    private header: CompareHeaderAdapter;
    private result: ResultEvaluationResult[] = [];
    private percentages: ResultEvaluationPercentages[] = [];

    constructor(criterias: CardComponentFields, objects: CardComponentFields, weighting: CompareComponentValues, evaluation: CompareComponentValues[], header: CompareHeaderAdapter) {
        this.criterias = criterias;
        this.objects = objects;
        this.weighting = weighting;
        this.evaluation = evaluation;
        this.header = header;

        this.eval();
    }

    public static from(criterias: CardComponentFields, objects: CardComponentFields, weighting: CompareComponentValues, evaluation: CompareComponentValues[], header: CompareHeaderAdapter) {
        return new ResultEvaluation(criterias, objects, weighting, evaluation, header);
    }

    public eval = () => {
        // prozente ausrechnen von der evaluation
        let evaluation = new WeightingEvaluation<any>(this.criterias, this.weighting);
        let values = evaluation.getValues();
        let sum = values.result.reduce((p, n) => p + n.points, 0);

        let percentages = [];

        // ermittle summe von den punkten
        for (let result of values.result) {
            percentages.push({
                criteria: result.criteria,
                points: result.points,
                percentage: (result.points / sum)
            });
        }

        let result = [];
        for (let object of this.objects) {
            result.push({
                object: object,
                points: 0,
                rank: 0
            });
        }

        // pro kriterium für jedes Objekt die Punkte nehmen * prozent
        for (let i = 0; i < percentages.length; i++) {
            let evaluation = this.evaluation[i];

            for (let e = 0; e < this.objects.length; e++) {
                let index = this.header.getIndex(evaluation.comparisons[e].header as string);
                if (index !== -1) {
                    result[e].points += (index + 1) * percentages[i].percentage;
                }
            }
        }

        let target: ResultEvaluationResult[] = []
        let resultSorted = Object.assign(target, result);
        resultSorted = resultSorted.sort((a, b) => {
            if (a.points > b.points) {
                return -1;
            }
            if (a.points < b.points) {
                return 1;
            }
            return 0;
        });

        // build rank
        let rank = 1;
        let i = 0;

        for (const object of resultSorted) {
            if (i > 0 && object.points < resultSorted[i - 1].points) {
                rank++;
            }
            // Die Schleife arbeitet zwar auf dem resultSorted Array,
            // aber die Referenzen auf die Objekte sind die selben wie im result Array!
            object.rank = rank;
            i++;
        }

        this.result = result;
        this.percentages = percentages;
    }

    public getResult = (): ResultEvaluationValue => {
        return {
            result: this.result,
            percentages: this.percentages
        };
    }

}

export {
    ResultEvaluation
}
