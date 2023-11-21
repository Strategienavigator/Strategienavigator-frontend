import {
    ExtraWindowDefinition,
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import React from "react";
import {PersonaPersonalityComponent, PersonaPersonalityValues} from "./PersonaPersonalityComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {PersonaAnalysisInfoShower} from "../../matrix/PersonaAnalysisInfoShower";
import {
    isCardComponentFilled,
    isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";
import {
    validateCardComponentWithNameFilled
} from "../../../../../general-components/CardComponent/CardComponentWithName";


export class PersonaPersonality implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues> {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    extraWindow: ExtraWindowDefinition<PersonaAnalysisValues>;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;

    constructor() {
        this.id = "persona-personality";
        this.title = "2. Personalität kreieren";
        this.form = PersonaPersonalityComponent;
        this.dataHandler = this;
        this.extraWindow = {
            displayName: "Ihr aktuelles Persona",
            extraWindowComponent: PersonaAnalysisInfoShower
        };
    }

    isUnlocked = (data: PersonaAnalysisValues): boolean => data["persona-personality"] !== undefined;

    fillFromPreviousValues = (data: PersonaAnalysisValues): PersonaAnalysisValues => {
        data["persona-personality"] = this.getDefault();
        return data;
    };

    deleteData(data: PersonaAnalysisValues): void {
        data["persona-personality"] = undefined;
    }

    validateData = (data: PersonaAnalysisValues): UIError[] => {
        let errors = Array<UIError>();
        let d = data["persona-personality"];

        if (d) {
            let names = Object.assign(
                {},
                d?.fields,
                d?.fieldsElse
            );

            // Fields
            for (const [name, values] of Object.entries(names)) {
                // empty
                if (!isCardComponentFilled(values, false)) {
                    errors.push({
                        id: `${name}.empty`,
                        message: "Bitte füllen Sie alle Felder aus!",
                        level: "error"
                    });
                }

                // too long
                if (isCardComponentTooLong(values)) {
                    errors.push({
                        id: `${name}.toolong`,
                        message: "Einige Feld sind zu Lang!",
                        level: "error"
                    });
                }
            }

            // Individuell
            validateCardComponentWithNameFilled(d.individual, "individual", errors);
        }
        return errors;
    }

    private getDefault = (): PersonaPersonalityValues => {
        return {
            fields: {
                demograph: [],
                pains: [],
                gains: []
            },
            individual: [],
            fieldsElse: {
                statements: [],
                motives: [],
                keywords: []
            }
        };
    }


}
