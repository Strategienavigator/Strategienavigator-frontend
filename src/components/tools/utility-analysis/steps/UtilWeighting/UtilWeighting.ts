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

    }

    isUnlocked(data: UtilityAnalysisValues): boolean {
        return false;
    }

    validateData(data: UtilityAnalysisValues): UIError[] {
        return [];
    }

}

export {
    UtilWeighting
}
