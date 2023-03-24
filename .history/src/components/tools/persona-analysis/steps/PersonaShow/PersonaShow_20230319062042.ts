

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
        this.id = "persona show";
        this.title = "3. persona show";
        this.form = PersonaShowComponent;
        this.dataHandler = this;
       
    }

    
    isUnlocked (data: PersonaAnalysisValues): boolean {
        console.log("result3", data["persona-factors"]?.factors.qualifikation!==undefined &&   data["persona-factors"].factors.qualifikation.length > 0)
        return  data["persona-factors"]?.factors.qualifikation!==undefined &&   data["persona-factors"].factors.qualifikation.length > 0
    };

    
    // isUnlocked = (data: PersonaAnalysisValues): boolean =>    false;

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => this.deleteData(data);

    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
       console.log("3showdata",data)
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        return errors;
    }
}