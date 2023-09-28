import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import React from "react";
import {PersonaInfoComponent} from "./PersonaInfoComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";


export class PersonaInfo implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues> {

    static FIRST_NAME_MAX_LENGTH = 100;
    static LAST_NAME_MAX_LENGTH = PersonaInfo.FIRST_NAME_MAX_LENGTH;

    static AGE_MIN = 0;
    static AGE_MAX = 150;

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;

    constructor() {
        this.id = "persona-info";
        this.title = "1. Stammdaten anlegen";
        this.form = PersonaInfoComponent;
        this.dataHandler = this;
    }

    isUnlocked = (data: PersonaAnalysisValues): boolean => true;

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => {
        data["persona-info"] = {
            "firstname": null,
            "lastname": null,
            "age": null,
            // TODO: build in backend resource port
            "avatar": "https://www.masslive.com/resizer/kNl3qvErgJ3B0Cu-WSBWFYc1B8Q=/arc-anglerfish-arc2-prod-advancelocal/public/W5HI6Y4DINDTNP76R6CLA5IWRU.jpeg"
        };
        return data;
    }

    deleteData(data: PersonaAnalysisValues): void {
        data = this.fillFromPreviousValues(data);
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        let d = data["persona-info"];
        let errors = Array<UIError>();

        // Vorname
        if (d?.firstname == null || d.firstname.length <= 0) {
            errors.push({
                id: "firstname.empty",
                message: "Bitte geben Sie einen Vornamen an!",
                level: "error"
            });
        } else if (d.firstname.length > PersonaInfo.FIRST_NAME_MAX_LENGTH) {
            errors.push({
                id: "firstname.toolong",
                message: "Der Vorname darf nur maximal " + PersonaInfo.FIRST_NAME_MAX_LENGTH + " Zeichen besitzen!",
                level: "error"
            });
        }

        // Nachname
        if (d?.lastname == null || d.lastname.length <= 0) {
            errors.push({
                id: "lastname.empty",
                message: "Bitte geben Sie einen Nachnamen an!",
                level: "error"
            });
        } else if (d.lastname.length > PersonaInfo.LAST_NAME_MAX_LENGTH) {
            errors.push({
                id: "lastname.toolong",
                message: "Der Nachname darf nur maximal " + PersonaInfo.LAST_NAME_MAX_LENGTH + " Zeichen besitzen!",
                level: "error"
            });
        }

        // Alter
        if (d?.age == null || d?.age === -1 || (d?.age < PersonaInfo.AGE_MIN || d?.age > PersonaInfo.AGE_MAX)) {
            errors.push({
                id: "age.invalid",
                message: `Bitte geben Sie eine Zahl zwischen ${PersonaInfo.AGE_MIN} und ${PersonaInfo.AGE_MAX} an!`,
                level: "error"
            });
        }

        return errors;
    }


}
