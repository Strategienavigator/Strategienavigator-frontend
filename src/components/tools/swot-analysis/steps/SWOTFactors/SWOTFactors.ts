import {StepDefinition} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTFactorsComponent} from "./SWOTFactorsComponent";
import {SteppableProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


export class SWOTFactors implements StepDefinition<SWOTAnalysisValues>{




    form: React.FunctionComponent<SteppableProp<SWOTAnalysisValues>> | React.ComponentClass<SteppableProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    constructor() {
        this.id = "swot-factors";
        this.title = "1. Faktoren festlegen";
        this.form = SWOTFactorsComponent;
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return true;
    }

    resetData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        data["swot-factors"].factors.risks = [];
        data["swot-factors"].factors.strengths = [];
        data["swot-factors"].factors.chances = [];
        data["swot-factors"].factors.weaknesses = [];
        return data;
    }

}
