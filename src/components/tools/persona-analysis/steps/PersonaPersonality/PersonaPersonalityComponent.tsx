import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";


export interface PersonaPersonalityValues {
    citations: CardComponentFields,
    hobbys: CardComponentFields,
    family: CardComponentFields,
    wishes: CardComponentFields,
    problems: CardComponentFields,
    characteristics: CardComponentFields,
    illness: CardComponentFields,

    [key: string]: CardComponentFields
}

export class PersonaPersonalityComponent extends Step<PersonaAnalysisValues, {}> {

    static DEFAULT_MIN = 0;
    static DEFAULT_MAX = 5;

    static MIN_CITATION = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_CITATION = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_HOBBYS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_HOBBYS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_WISHES = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_WISHES = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_MOTIVES = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_MOTIVES = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_PROBLEMS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_PROBLEMS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_ILLNESS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_ILLNESS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_FAMILY = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_FAMILY = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_CHARACTERISTICS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_CHARACTERISTICS = PersonaPersonalityComponent.DEFAULT_MAX;
    static COUNTER = new NumberCounter();
    // Change listener
    private citationsChanged = this.applyChanges.bind(this, "cit");
    private hobbysChanged = this.applyChanges.bind(this, "hob");
    private familyChanged = this.applyChanges.bind(this, "fam");
    private illnessChanged = this.applyChanges.bind(this, "ill");
    private problemsChanged = this.applyChanges.bind(this, "pro");
    private wishesChanged = this.applyChanges.bind(this, "wis");
    private characteristicsChanged = this.applyChanges.bind(this, "cha");
    public items = [
        {
            legend: "Hobbys und Interessen",
            name: "hobbys",
            min: PersonaPersonalityComponent.MIN_HOBBYS,
            max: PersonaPersonalityComponent.MAX_HOBBYS,
            changeListener: this.hobbysChanged
        },
        {
            legend: "Krankheiten",
            name: "illness",
            min: PersonaPersonalityComponent.MIN_ILLNESS,
            max: PersonaPersonalityComponent.MAX_ILLNESS,
            changeListener: this.illnessChanged
        },
        {
            legend: "Familie und Freunde",
            name: "family",
            min: PersonaPersonalityComponent.MIN_FAMILY,
            max: PersonaPersonalityComponent.MAX_FAMILY,
            changeListener: this.familyChanged
        },
        {
            legend: "Probleme und Hürden",
            name: "problems",
            min: PersonaPersonalityComponent.MIN_PROBLEMS,
            max: PersonaPersonalityComponent.MAX_PROBLEMS,
            changeListener: this.problemsChanged
        },
        {
            legend: "Wünsche und Ziele",
            name: "wishes",
            min: PersonaPersonalityComponent.MIN_WISHES,
            max: PersonaPersonalityComponent.MAX_WISHES,
            changeListener: this.wishesChanged
        },
        {
            legend: "Charakteristiken",
            name: "characteristics",
            min: PersonaPersonalityComponent.MIN_CHARACTERISTICS,
            max: PersonaPersonalityComponent.MAX_CHARACTERISTICS,
            changeListener: this.characteristicsChanged
        },
        {
            legend: "Zitate und Sprüche",
            name: "citations",
            min: PersonaPersonalityComponent.MIN_CITATION,
            max: PersonaPersonalityComponent.MAX_CITATION,
            changeListener: this.citationsChanged
        },
    ];

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let data = this.props.save.data["persona-personality"];

        if (data) {
            return (
                <>
                    {(this.items.map((item) => {
                        if (data) {
                            return (
                                <fieldset key={`persona-item-${item.name}`}>
                                    <legend>{item.legend}</legend>
                                    <div>
                                        <CardComponent
                                            name={item.name}
                                            values={data[item.name]}
                                            disabled={this.props.disabled}
                                            min={item.min}
                                            max={item.max}
                                            counter={PersonaPersonalityComponent.COUNTER}
                                            hideDesc={true}
                                            required={true}
                                            onChanged={item.changeListener}
                                        />
                                        <UIErrorBanner id={`${item.name}.empty`}/>
                                        <UIErrorBanner id={`${item.name}.toolong`}/>
                                    </div>
                                </fieldset>
                            );
                        }
                        return null;
                    }))}
                </>
            );
        }
        return (<></>);
    }

    private applyChanges(type: "cit" | "hob" | "fam" | "ill" | "pro" | "wis" | "cha", values: CardComponentFields) {
        this.props.saveController.onChanged(save => {
            const data = save.data["persona-personality"];
            if (data) {
                switch (type) {
                    case "cit":
                        data.citations = values;
                        break;
                    case "hob":
                        data.hobbys = values;
                        break;
                    case "ill":
                        data.illness = values;
                        break;
                    case "fam":
                        data.family = values;
                        break;
                    case "pro":
                        data.problems = values;
                        break;
                    case "wis":
                        data.wishes = values;
                        break;
                    case "cha":
                        data.characteristics = values;
                        break;
                }
            }
        });
    }

}
