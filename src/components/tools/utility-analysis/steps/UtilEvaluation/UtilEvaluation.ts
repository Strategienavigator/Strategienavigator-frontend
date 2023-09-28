import {
    ExtraWindowDefinition,
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilEvaluationComponent} from "./UtilEvaluationComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilCriterias} from "../UtilCriterias/UtilCriterias";
import {CompareComponentValues} from "../../../../../general-components/CompareComponent/CompareComponent";
import {WeightingEvaluation} from "../../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation";
import {PortScaleDescriptionShower} from "../../../portfolio-analysis/matrix/PortScaleDescriptionShower";
import {PortfolioAnalysisValues} from "../../../portfolio-analysis/PortfolioAnalysis";
import {UAScaleDescriptionShower} from "../../matrix/UAScaleDescriptionShower";


class UtilEvaluation implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    public static header = UtilCriterias.header;

    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;
    extraWindow: ExtraWindowDefinition<UtilityAnalysisValues>;

    constructor() {
        this.id = "ua-evaluation";
        this.title = "4. Bewertung > Kriterien nach Objekt";
        this.form = UtilEvaluationComponent;
        this.dataHandler = this;
        this.extraWindow = {
            displayName: "Die aktuelle Skalabeschreibung",
            extraWindowComponent: UAScaleDescriptionShower
        };
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
        data["ua-evaluation"] = undefined;
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
        let criterias = data["ua-criterias"];
        let weighting = data["ua-weighting"];
        let objects = data["ua-investigation-obj"];
        let evaluation = data["ua-evaluation"];
        let evaluations = [];

        if (criterias && objects && weighting) {
            for (let c = 0; c < criterias.criterias.length; c++) {
                let objectsIndexes = [];
                for (let o = 0; o < objects.objects.length; o++) {
                    objectsIndexes.push(o);
                }

                let rating: CompareComponentValues;
                if (evaluation) {
                    rating = evaluation.evaluation[c].rating;
                } else {
                    rating = {
                        comparisons: [],
                        headers: []
                    };
                    for (let o = 0; o < objects.objects.length; o++) {
                        rating.comparisons.push({
                            value: null,
                            header: null
                        });
                    }
                    rating.headers = UtilEvaluation.header.getHeaders();
                }

                evaluations.push({
                    criteriaIndex: c,
                    objects: objectsIndexes,
                    rating: rating
                });
            }

            data["ua-evaluation"] = {
                evaluation: evaluations
            };
        }
    }

    isUnlocked(data: UtilityAnalysisValues): boolean {
        return data["ua-evaluation"] !== undefined && Object.keys(data["ua-evaluation"]).length > 0;
    }

    validateData(data: UtilityAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let criterias = data["ua-criterias"];
        let evaluation = data["ua-evaluation"];
        let weighting = data["ua-weighting"];

        if (evaluation && weighting && criterias) {
            let weightingEval = new WeightingEvaluation(criterias.criterias, weighting);

            let errorFound = false;
            let i = 0;

            while (!errorFound && i < evaluation.evaluation.length) {
                let e = 0;
                let criteria = criterias.criterias[evaluation.evaluation[i].criteriaIndex];

                if (weightingEval.getValues().result.some((item) => {
                    return item.criteria === criteria && item.points !== 0;
                })) {
                    while (!errorFound && e < evaluation.evaluation[i].rating.comparisons.length) {
                        let value = evaluation.evaluation[i].rating.comparisons[e].value;

                        if (value === null || value === "") {
                            errorFound = true;
                        }
                        e++;
                    }
                }
                i++;
            }
            if (errorFound) {
                errors.push({
                    id: "ua-evaluation.empty",
                    level: "error",
                    message: "Bitte bewerten Sie alle Kriterien!"
                });
            }
        }

        return errors;
    }

}

export {
    UtilEvaluation
}


