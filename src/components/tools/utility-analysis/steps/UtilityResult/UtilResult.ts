import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilResultComponent} from "./UtilResultComponent";
import {Evaluation} from "../../../../../general-components/EvaluationComponent/Evaluation";
import {UACriteriaCustomDescriptionValues} from "../UtilCriterias/UACriteriaCustomDescription";
import {UtilEvaluation} from "../UtilEvaluation/UtilEvaluation";


class UtilResult implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.id = "ua-result";
        this.title = "5. Bewertungsübersicht";
        this.form = UtilResultComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
        data["ua-result"] = undefined;
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
        if (data["ua-weighting"] && data["ua-criterias"] && data["ua-evaluation"] && data["ua-investigation-obj"]) {
            // prozente ausrechnen von der evaluation
            let evaluation = new Evaluation<UACriteriaCustomDescriptionValues>(data["ua-criterias"].criterias, data["ua-weighting"]);
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
            for (let object of data["ua-investigation-obj"].objects) {
                result.push({
                    object: object,
                    points: 0,
                    rank: 0
                });
            }

            const getEvaluation = (name: string) => {
                if (data["ua-evaluation"] && data["ua-criterias"]) {
                    for (let evaluation of data["ua-evaluation"].evaluation) {
                        if (data["ua-criterias"].criterias[evaluation.criteriaIndex].name === name) {
                            return evaluation;
                        }
                    }
                }
                return null;
            }

            // pro kriterium für jedes Objekt die Punkte nehmen * prozent
            let i = 0;
            for (let percentage of percentages) {
                let evaluation = getEvaluation(percentage.criteria.name);

                if (evaluation !== null) {
                    // data["ua-criterias"].criterias[evaluation.criteriaIndex].name
                    for (let objectIndex of evaluation.objects) {
                        let index = UtilEvaluation.header.getIndex(evaluation.rating.comparisons[objectIndex].header as string);
                        if (index !== -1) {
                            result[objectIndex].points += (index + 1) * percentages[i].percentage;
                        }
                    }
                    i++;
                }
            }

            result = result.sort((a, b) => {
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
            i = 0;

            for (const field of result) {
                if (i > 0 && field.points < result[i - 1].points) {
                    rank++;
                }
                field.rank = rank;
                i++;
            }

            data["ua-result"] = {
                percentages: percentages,
                result: result
            };

            console.log(data["ua-result"]);
        }
    }


    isUnlocked(data: UtilityAnalysisValues): boolean {
        return (data["ua-result"] !== undefined && Object.keys(data["ua-result"]).length > 0);
    }


    validateData(data: UtilityAnalysisValues): UIError[] {
        return [];
    }

}


export {
    UtilResult
}
