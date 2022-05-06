import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {CompareNumberHeader} from "../../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {UtilWeightingComponent} from "./UtilWeightingComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";


class UtilWeighting implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    public static header = new CompareNumberHeader(0, 3);

    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.id = "ua-weighting";
        this.title = "3. Gewichtung der Kriterien";
        this.form = UtilWeightingComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
        data["ua-weighting"] = undefined;
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
        const criterias = data["ua-criterias"];
        const weighting = data["ua-weighting"];
        let comparisons = [];

        if (criterias) {
            const adapter = new MatchCardComponentFieldsAdapter(criterias.criterias);
            for (let i = 0; i < adapter.getLength(); i++) {
                let dataItem;

                if (weighting) {
                    dataItem = weighting.comparisons[i];
                    comparisons.push(dataItem);
                } else {
                    comparisons.push({
                        value: null,
                        header: null
                    });
                }
            }
            data["ua-weighting"] = {
                comparisons: comparisons,
                headers: UtilWeighting.header.getHeaders()
            }
        }
    }

    isUnlocked(data: UtilityAnalysisValues): boolean {
        return data["ua-weighting"] !== undefined && Object.keys(data["ua-weighting"]).length > 0;
    }

    validateData(data: UtilityAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let criterias = data["ua-criterias"];
        let weighting = data["ua-weighting"];

        if (criterias && weighting) {
            let found = false;
            for (let i = 0; i < weighting.comparisons.length; i++) {
                let value = weighting.comparisons[i].value;
                if (value === null || value === "") {
                    found = true;
                }
            }

            if (found) {
                errors.push({
                    id: "utility-analysis.empty",
                    level: "error",
                    message: "Bitte gewichten Sie alle Kriterien!"
                });
            }
        }
        return errors;
    }

}

export {
    UtilWeighting
}
