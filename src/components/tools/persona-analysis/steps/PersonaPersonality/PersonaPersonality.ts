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

    private properties = [
        {
            name: "demograph",
            min: PersonaPersonalityComponent.MIN_DEMO,
            max: PersonaPersonalityComponent.MAX_DEMO,
        },
        {
            name: "pains",
            min: PersonaPersonalityComponent.MIN_PAINS,
            max: PersonaPersonalityComponent.MAX_PAINS,
        },
        {
            name: "gains",
            min: PersonaPersonalityComponent.MIN_GAINS,
            max: PersonaPersonalityComponent.MAX_GAINS,
        },
        {
            name: "statements",
            min: PersonaPersonalityComponent.MIN_STATEMENTS,
            max: PersonaPersonalityComponent.MAX_STATEMENTS,
        },
        {
            name: "motives",
            min: PersonaPersonalityComponent.MIN_MOTIVES,
            max: PersonaPersonalityComponent.MAX_MOTIVES,
        }
    ];

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
        let d = this.properties.map((i) => i.name).reduce((a, v) => ({...a, [v]: []}), {}) as PersonaPersonalityValues;

        d.fields = {
            demograph: [],
            pains: [],
            gains: [],
            statements: [],
            motives: []
        };

        // generiere leere zeilen für min werte
        for (const item of this.properties) {
            for (let i = 0; i < item.min; i++) {
                d.fields[item.name].push({
                    name: "",
                    desc: "",
                    id: PersonaPersonalityComponent.COUNTER.get(i + 1)
                });
            }
        }
        d.individual = [];
        data["persona-personality"] = d;
        return data;
    };

    deleteData(data: PersonaAnalysisValues): void {
        data["persona-personality"] = undefined;
    }

    validateData = (data: PersonaAnalysisValues): UIError[] => {
        let errors = Array<UIError>();
        let names = this.properties.map((item) => item.name);
        let d = data["persona-personality"];

        if (d) {
            // Fields
            for (const name of names) {
                // empty
                if (!isCardComponentFilled(d.fields[name], false)) {
                    errors.push({
                        id: `${name}.empty`,
                        message: "Bitte füllen Sie alle Felder aus!",
                        level: "error"
                    });
                }

                // too long
                if (isCardComponentTooLong(d.fields[name])) {
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


}
