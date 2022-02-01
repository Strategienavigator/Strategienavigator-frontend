import {StepDefinition} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTAlternativeActionsComponent} from "./SWOTAlternativeActionsComponent";
import {SteppableProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {SWOTAnalysisMatrix} from "../../matrix/SWOTAnalysisMatrix";
import {MatrixComponentProps} from "../../../../../general-components/Tool/MatrixComponent/MatrixComponent";

export class SWOTAlternativeActions implements StepDefinition<SWOTAnalysisValues>{
    form: React.FunctionComponent<SteppableProp<SWOTAnalysisValues>> | React.ComponentClass<SteppableProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    matrix: React.FunctionComponent<MatrixComponentProps<SWOTAnalysisValues>> | React.ComponentClass<MatrixComponentProps<SWOTAnalysisValues>>;



    constructor() {
        this.id = "alternative-actions";
        this.title = "2. Handlungsalternativen festlegen";
        this.form = SWOTAlternativeActionsComponent;
        this.matrix = SWOTAnalysisMatrix;
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return Object.keys(data["alternative-actions"]).length > 0;
    }

    resetData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        data["alternative-actions"].actions = [];
        return data;
    }



}
