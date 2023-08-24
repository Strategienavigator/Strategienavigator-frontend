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
            max:PersonaPersonalityComponent.MAX_CITATION
        }
    ];

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
        let d: PersonaPersonalityValues = {
            citations: []
        };

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
