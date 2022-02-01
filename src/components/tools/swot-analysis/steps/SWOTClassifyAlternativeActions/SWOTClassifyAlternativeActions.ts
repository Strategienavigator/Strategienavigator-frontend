import {StepDefinition} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SteppableProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {SWOTClassifyAlternativeActionsComponent} from "./SWOTClassifyAlternativeActionsComponent";

export class SWOTClassifyAlternativeActions implements StepDefinition<SWOTAnalysisValues> {
    form: React.FunctionComponent<SteppableProp<SWOTAnalysisValues>> | React.ComponentClass<SteppableProp<SWOTAnalysisValues>>;
    id: string;
    title: string;


    constructor() {
        this.id = "swot-classify-alternate-actions";
        this.title = "3. Handlungsalternativen klassifizieren";
        this.form = SWOTClassifyAlternativeActionsComponent;
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return Object.keys(data["swot-classify-alternate-actions"]).length > 0;
    }

    resetData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        return ;
    }


}
