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


export class PersonaPersonality implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues> {

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    extraWindow: ExtraWindowDefinition<PersonaAnalysisValues>;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;

    private properties = [
        {
            name: "citations",
            min: PersonaPersonalityComponent.MIN_CITATION,
            max: PersonaPersonalityComponent.MAX_CITATION
        },
        {
            name: "hobbys",
            min: PersonaPersonalityComponent.MIN_HOBBYS,
            max: PersonaPersonalityComponent.MAX_HOBBYS
        },
        {
            name: "illness",
            min: PersonaPersonalityComponent.MIN_ILLNESS,
            max: PersonaPersonalityComponent.MAX_ILLNESS
        },
        {
            name: "family",
            min: PersonaPersonalityComponent.MIN_FAMILY,
            max: PersonaPersonalityComponent.MAX_FAMILY
        },
        {
            name: "wishes",
            min: PersonaPersonalityComponent.MIN_WISHES,
            max: PersonaPersonalityComponent.MAX_WISHES
        },
        {
            name: "motives",
            min: PersonaPersonalityComponent.MIN_MOTIVES,
            max: PersonaPersonalityComponent.MAX_MOTIVES
        },
        {
            name: "problems",
            min: PersonaPersonalityComponent.MIN_PROBLEMS,
            max: PersonaPersonalityComponent.MAX_PROBLEMS
        },
        {
            name: "characteristics",
            min: PersonaPersonalityComponent.MIN_CHARACTERISTICS,
            max: PersonaPersonalityComponent.MAX_CHARACTERISTICS
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

        // generiere leere zeilen für min werte
        for (const item of this.properties) {
            for (let i = 0; i < item.min; i++) {
                d[item.name].push({
                    name: "",
                    desc: "",
                    id: PersonaPersonalityComponent.COUNTER.get(i + 1)
                });
            }
        }

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
            for (const name of names) {
                // empty
                if (!isCardComponentFilled(d[name], false)) {
                    errors.push({
                        id: `${name}.empty`,
                        message: "Bitte füllen Sie alle Felder aus!",
                        level: "error"
                    });
                }

                // too long
                if (isCardComponentTooLong(d[name])) {
                    errors.push({
                        id: `${name}.toolong`,
                        message: "Einige Feld sind zu Lang!",
                        level: "error"
                    });
                }
            }
        }

        return errors;
    }


}
