import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilResultComponent} from "./UtilResultComponent";
import {UtilEvaluation} from "../UtilEvaluation/UtilEvaluation";
import {ResultEvaluation} from "../../../../../general-components/EvaluationComponent/Result/ResultEvaluation";


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
            let evaluation = data["ua-evaluation"].evaluation.map((value) => {
                return value.rating;
            });

            let resultEvaluation = ResultEvaluation.from(data["ua-criterias"].criterias, data["ua-investigation-obj"].objects, data["ua-weighting"], evaluation, UtilEvaluation.header);
            data["ua-result"] = resultEvaluation.getResult();
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
