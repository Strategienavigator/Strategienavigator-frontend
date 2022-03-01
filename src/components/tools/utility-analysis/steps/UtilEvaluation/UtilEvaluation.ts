import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilEvaluationComponent} from "./UtilEvaluationComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";

class UtilEvaluation implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;


    constructor() {
        this.id = "ua-evaluation";
        this.title = "4. Bewertung > Objekt nach Kriterien";
        this.form = UtilEvaluationComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
    }


    isUnlocked(data: UtilityAnalysisValues): boolean {
        return false;
    }


    validateData(data: UtilityAnalysisValues): UIError[] {
        return [];
    }


}

export {
    UtilEvaluation
}


