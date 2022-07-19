import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortEvaluationComponent} from "./PortEvaluationComponent";
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
            let attractivityCriterias = criterias["attractivity"];
            let standingCriterias = criterias["comp-standing"];

            let compareValues = objects.objects.map(() => {
                return {
                    value: null,
                    header: null
                };
            });
            let attractivitys = [];
            let standings = [];

            for (let i = 0; i < attractivityCriterias.length; i++) {
                attractivitys.push({
                    comparisons: compareValues,
                    headers: PortEvaluation.header.getHeaders()
                });
            }
            for (let i = 0; i < standingCriterias.length; i++) {
                standings.push({
                    comparisons: compareValues,
                    headers: PortEvaluation.header.getHeaders()
                });
            }

            data["port-evaluation"] = {
                attractivity: attractivitys,
                "comp-standing": standings
            };
        }
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-evaluation"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let evaluation = data["port-evaluation"]?.attractivity;

        if (evaluation !== undefined) {
            let errorFound = false;
            let i = 0;
            while (!errorFound && i < evaluation.length) {
                let e = 0;
                while (!errorFound && e < evaluation[i].comparisons.length) {
                    let value = evaluation[i].comparisons[e].value;
                    if (value === null || value === "") {
                        errorFound = true;
                    }
                    e++;
                }
                i++;
            }

            if (errorFound) {
                errors.push({
                    id: "port-evaluation.empty",
                    message: "Es müssen alle Kriterien bewertet werden!",
                    level: "error"
                });
            } else {
                evaluation = data["port-evaluation"]?.["comp-standing"];
                i = 0;

                if (evaluation) {
                    while (!errorFound && i < evaluation.length) {
                        let e = 0;
                        while (!errorFound && e < evaluation[i].comparisons.length) {
                            let value = evaluation[i].comparisons[e].value;
                            if (value === null || value === "") {
                                errorFound = true;
                            }
                            e++;
                        }
                        i++;
                    }
                }
                if(errorFound) {
                    errors.push({
                        id: "port-evaluation.empty",
                        message: "Es müssen alle Kriterien bewertet werden!",
                        level: "error"
                    });
                }
            }
        }
        return errors;
    }

}