

import {
    StepDataHandler,
    StepDefinition,

} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValues , UploadImgInfoValues} from "../../steps/SWOTAlternativeActions/UpdateImgActionsValuesComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import { PersonaShowComponent } from "./PersonaShowComponent";

export class PersonaShow implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "Profibild hochladen";
        this.title = "1. Profibild hochladen";
        this.form = PersonaShowComponent;
        this.dataHandler = this;
       
    }

    
    isUnlocked = (data: PersonaAnalysisValues): boolean =>    true;

    fillFromPreviousValues(){
        
    }
}