import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortWeightingComponent} from "./PortWeightingComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {CompareNumberHeader} from "../../../../../general-components/CompareComponent/Header/CompareNumberHeader";


export class PortWeighting implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    public static header = new CompareNumberHeader(0, 3);

    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortWeightingComponent;
        this.id = "port-weighting";
        this.title = "3. Gewichtung";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-weighting"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
        let criterias = data["port-criterias"];

        if (criterias !== undefined) {
            // Attractivity
            let attAdapter = new MatchCardComponentFieldsAdapter(criterias["attractivity"]);
            let attComparisons = attAdapter.toArray().map(() => {
                return {
                    value: null,
                    header: null
                };
            });

            // Comp-Standing
            let compAdapter = new MatchCardComponentFieldsAdapter(criterias["comp-standing"]);
            let compComparisons = compAdapter.toArray().map(() => {
                return {
                    value: null,
                    header: null
                };
            });

            data["port-weighting"] = {
                "attractivity": {
                    comparisons: attComparisons,
                    headers: PortWeighting.header.getHeaders()
                },
                "comp-standing": {
                    comparisons: compComparisons,
                    headers: PortWeighting.header.getHeaders()
                }
            };
        }
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-weighting"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let weighting = data["port-weighting"];

        if (weighting !== undefined) {
            let found = false;
            for (let i = 0; i < weighting["attractivity"].comparisons.length; i++) {
                let comparison = weighting["attractivity"].comparisons[i];
                if (comparison.value === null) {
                    found = true;
                }
            }
            if (found) {
                errors.push({
                    id: "attractivity-weighting.empty",
                    level: "error",
                    message: "Bitte gewichten Sie alle Kriterien!"
                });
            }
            found = false;
            for (let i = 0; i < weighting["comp-standing"].comparisons.length; i++) {
                let comparison = weighting["comp-standing"].comparisons[i];
                if (comparison.value === null) {
                    found = true;
                }
            }
            if (found) {
                errors.push({
                    id: "compStanding-weighting.empty",
                    level: "error",
                    message: "Bitte gewichten Sie alle Kriterien!"
                });
            }
        }

        return errors;
    }

}