import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortEvaluationComponent, PortEvaluationValues} from "./PortEvaluationComponent";
import {WritableDraft} from "immer/dist/internal";
import {
    CompareComponentValues,
    CompareValue
} from "../../../../../general-components/CompareComponent/CompareComponent";
import {CompareHeader} from "../../../../../general-components/CompareComponent/Header/CompareHeaderAdapter";
import {CompareSymbolHeader} from "../../../../../general-components/CompareComponent/Header/CompareSymbolHeader";


export class PortEvaluation implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    public static header = new CompareSymbolHeader(["--", "-", "0", "+", "++"]);

    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortEvaluationComponent;
        this.id = "port-evaluation";
        this.title = "4. Bewertung";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-evaluation"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
        let criterias = data["port-criterias"];
        let objects = data["port-objects"];

        if (criterias !== undefined && objects !== undefined) {
            let allCriterias = criterias["attractivity"].concat(criterias["comp-standing"]);
            let evaluations: any[] = [];

            let compareValues = objects.objects.map(() => {
               return {
                 value: null,
                 header: null
               };
            });

            for (let i = 0; i < allCriterias.length; i++) {
                evaluations.push({
                    criteriaIndex: i,
                    rating: {
                        comparisons: compareValues,
                        headers: PortEvaluation.header.getHeaders()
                    }
                });
            }

            data["port-evaluation"] = {
                evaluation: evaluations
            };
        }
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-evaluation"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let evaluation = data["port-evaluation"];

        if(evaluation !== undefined) {
            let errorFound = false;
            let i = 0;
            while(!errorFound && i < evaluation.evaluation.length) {
                let e = 0;
                while (!errorFound && e < evaluation.evaluation[i].rating.comparisons.length) {
                    let value = evaluation.evaluation[i].rating.comparisons[e].value;
                    if (value === null || value === "") {
                        errorFound = true;
                    }
                    e++;
                }
                i++;
            }
            if(errorFound) {
                errors.push(
                    {
                        id: "port-evaluation.empty",
                        message: "Es müssen alle Kriterien bewertet werden!",
                        level: "error"
                    }
                )
            }
        }


        return errors;
    }

}