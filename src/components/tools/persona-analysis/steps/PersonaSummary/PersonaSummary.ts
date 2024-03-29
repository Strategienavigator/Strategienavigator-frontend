import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import React from "react";
import {PersonaSummaryComponent} from "./PersonaSummaryComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";


export class PersonaSummary implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues> {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;

    constructor() {
        this.id = "persona-summary";
        this.title = "3. Ihr Persona";
        this.form = PersonaSummaryComponent;
        this.dataHandler = this;
    }

    isUnlocked = (data: PersonaAnalysisValues): boolean => data["persona-summary"] !== undefined;

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => {
        data["persona-summary"] = null;
        return data;
    };

    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        data["persona-summary"] = undefined;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        return Array<UIError>();
    }


}
