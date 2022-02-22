import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilResultComponent} from "./UtilResultComponent";

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
    UtilResult
}
