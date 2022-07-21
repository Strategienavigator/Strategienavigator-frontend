import {CardComponentField, CardComponentFields} from "../../CardComponent/CardComponent";
import {CompareComponentValues} from "../../CompareComponent/CompareComponent";
import {WeightingEvaluation} from "../Weighting/WeightingEvaluation";
import {CompareHeaderAdapter} from "../../CompareComponent/Header/CompareHeaderAdapter";


/**
 * Enthält die Werte eines einzelnen Ergebnisses zugeordnet zum Objekt
 */
export interface ResultEvaluationResult {
    /**
     * Untersuchungsobjekt
     */
    object: CardComponentField,
    /**
     * Punkteanzahl
     */
    points: number,
    /**
     * Rang im Vergleich zu anderen Untersuchungsobjekten
     */
    rank: number
}

/**
 * Enthält die Gewichtsverteilung eines einzelnen Kriteriums
 */
export interface ResultEvaluationPercentages {
    /**
     * Kriterium
     */
    criteria: CardComponentField,
    /**
     * Punkteanzahl
     */
    points: number,
    /**
     * Prozentverteilung der Gewichtung
     */
    percentage: number
}

/**
 * Rückgabewerte der Evaluation
 */
export interface ResultEvaluationValue {
    /**
     * Enthält die Werte der Ergebnisse inklusive Rang und Punkte
     */
    result: ResultEvaluationResult[],
    /**
     * Enthält die Prozentzahlen der Gewichtungsverteilung
     */
    percentages: ResultEvaluationPercentages[]
}

/**
 * Dient zum Berechnen von Analysen.
 * z.B. Nutzwertanalyse, Portfolio-Analyse
 */
class ResultEvaluation {
    private readonly criterias: CardComponentFields;
    private readonly objects: CardComponentFields;
    private readonly weighting: CompareComponentValues;
    private readonly evaluation: CompareComponentValues[];

    private header: CompareHeaderAdapter;
    private result: ResultEvaluationResult[] = [];
    private percentages: ResultEvaluationPercentages[] = [];

    /**
     * @param {CardComponentFields} criterias Die Kriterien der Analyse
     * @param {CardComponentFields} objects Die Objekte der Analyse
     * @param {CompareComponentValues} weighting Die Gewichtung der Analyse
     * @param {CompareComponentValues[]} evaluation Die Evaluation der Analyse
     * @param {CompareHeaderAdapter} header Der Header der Bewertung
     */
    constructor(criterias: CardComponentFields, objects: CardComponentFields, weighting: CompareComponentValues, evaluation: CompareComponentValues[], header: CompareHeaderAdapter) {
        this.criterias = criterias;
        this.objects = objects;
        this.weighting = weighting;
        this.evaluation = evaluation;
        this.header = header;

        this.eval();
    }

    /**
     * Erstellt eine Instanz von ResultEvaluation.
     *
     * @param {CardComponentFields} criterias Die Kriterien der Analyse
     * @param {CardComponentFields} objects Die Objekte der Analyse
     * @param {CompareComponentValues} weighting Die Gewichtung der Analyse
     * @param {CompareComponentValues[]} evaluation Die Evaluation der Analyse
     * @param {CompareHeaderAdapter} header Der Header der Bewertung
     * @returns {ResultEvaluation} Instanz von ResultEvaluation
     */
    public static from(criterias: CardComponentFields, objects: CardComponentFields, weighting: CompareComponentValues, evaluation: CompareComponentValues[], header: CompareHeaderAdapter) {
        return new ResultEvaluation(criterias, objects, weighting, evaluation, header);
    }

    /**
     * Berechnet die Werte des Ergebnisses
     */
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
        resultSorted = WeightingEvaluation.sort(resultSorted);

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

    /**
     * Gibt die berechneten Ergebnisse zurück
     * @returns {ResultEvaluationValue} Die durch die Methode eval() berechneten Ergebnisse
     */
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
