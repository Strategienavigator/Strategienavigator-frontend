

import {
    StepDataHandler,
    StepDefinition,
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
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

    // TODO Determine whether the first two pages are complete finished
    isUnlocked (data: PersonaAnalysisValues): boolean {
        let flag1 :boolean = data['uploadImage_actions']?.factors.name !== undefined && data['uploadImage_actions']?.factors.name.length > 0;
        let flag2 :boolean = data["persona-factors"]?.factors.qualifikation!==undefined &&   data["persona-factors"].factors.qualifikation.length > 0
        && data["persona-factors"].factors.qualifikation[0].name !== '';
        console.log("result3",flag1,flag2, flag1 && flag2)
        return flag1 && flag2;
    };

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => this.deleteData(data);

    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        return errors;
    }
}