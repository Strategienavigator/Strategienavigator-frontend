import {
    ExtraWindowDefinition,
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import React from "react";
import {PersonaPersonalityComponent} from "./PersonaPersonalityComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {PersonaAnalysisInfoShower} from "../../matrix/PersonaAnalysisInfoShower";


export class PersonaPersonality implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues> {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    extraWindow: ExtraWindowDefinition<PersonaAnalysisValues>;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;

    constructor() {
        this.id = "persona-info";
        this.title = "2. Personalität kreieren";
        this.form = PersonaPersonalityComponent;
        this.dataHandler = this;
        this.extraWindow = {
            displayName: "Ihr aktuelles Persona",
            extraWindowComponent: PersonaAnalysisInfoShower
        };
    }

    isUnlocked = (data: PersonaAnalysisValues): boolean => data["persona-personality"] !== undefined;

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => this.deleteData(data);

    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        return Array<UIError>();
    }


}
