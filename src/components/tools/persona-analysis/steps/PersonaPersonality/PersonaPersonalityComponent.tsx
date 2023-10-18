import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {
    CardComponentFieldsWithName,
    CardComponentWithName
} from "../../../../../general-components/CardComponent/CardComponentWithName";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faFire, faHeartbeat, faHeartBroken, faMicrophone, faUser} from "@fortawesome/free-solid-svg-icons";


export interface PersonaPersonalityValues {
    fields: {
        demograph: CardComponentFields,
        pains: CardComponentFields,
        gains: CardComponentFields,
        statements: CardComponentFields,
        motives: CardComponentFields,
        [key: string]: CardComponentFields,
    }
    individual: CardComponentFieldsWithName
}

export class PersonaPersonalityComponent extends Step<PersonaAnalysisValues, {}> {

    static DEFAULT_MIN = 0;
    static DEFAULT_MAX = 5;

    static MIN_DEMO = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_DEMO = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_PAINS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_PAINS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_GAINS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_GAINS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_STATEMENTS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_STATEMENTS = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_MOTIVES = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_MOTIVES = PersonaPersonalityComponent.DEFAULT_MAX;

    static MIN_INDIVIDUAL = 0;
    static MAX_INDIVIDUAL = 5;

    static MIN_INDIVIDUAL_CARDS = PersonaPersonalityComponent.DEFAULT_MIN;
    static MAX_INDIVIDUAL_CARDS = PersonaPersonalityComponent.DEFAULT_MAX;

    static COUNTER = new NumberCounter();
    public static names: string[] = [
        "Demographische Daten",
        "Pains (Frust, Probleme, Schmerzpunkte)",
        "Gains (Ziele, Wünsche, Gewinne)",
        "Statements (Zitate, Aussagen)",
        "Dominierendes Grundmotiv"
    ];
    public static icons: IconDefinition[] = [
        faUser,
        faHeartBroken,
        faHeartbeat,
        faMicrophone,
        faFire
    ];
    // Change listener
    private demoChanged = this.applyChanges.bind(this, "demo");
    private painsChanged = this.applyChanges.bind(this, "pain");
    private gainsChanged = this.applyChanges.bind(this, "gain");
    private statementsChanged = this.applyChanges.bind(this, "state");
    private motivesChanged = this.applyChanges.bind(this, "mot");
    public items = [
        {
            legend: PersonaPersonalityComponent.names[0],
            name: "demograph",
            min: PersonaPersonalityComponent.MIN_DEMO,
            max: PersonaPersonalityComponent.MAX_DEMO,
            changeListener: this.demoChanged
        },
        {
            legend: PersonaPersonalityComponent.names[1],
            name: "pains",
            min: PersonaPersonalityComponent.MIN_PAINS,
            max: PersonaPersonalityComponent.MAX_PAINS,
            changeListener: this.painsChanged
        },
        {
            legend: PersonaPersonalityComponent.names[2],
            name: "gains",
            min: PersonaPersonalityComponent.MIN_GAINS,
            max: PersonaPersonalityComponent.MAX_GAINS,
            changeListener: this.gainsChanged
        },
        {
            legend: PersonaPersonalityComponent.names[3],
            name: "statements",
            min: PersonaPersonalityComponent.MIN_STATEMENTS,
            max: PersonaPersonalityComponent.MAX_STATEMENTS,
            changeListener: this.statementsChanged
        },
        {
            legend: PersonaPersonalityComponent.names[4],
            name: "motives",
            min: PersonaPersonalityComponent.MIN_MOTIVES,
            max: PersonaPersonalityComponent.MAX_MOTIVES,
            changeListener: this.motivesChanged
        }
    ];

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let data = this.props.save.data["persona-personality"];

        if (data) {
            return (
                <>
                    <h1>Vorgeschriebene Felder</h1>

                    {(this.items.map((item) => {
                        if (data) {
                            return (
                                <fieldset key={`persona-item-${item.name}`}>
                                    <legend>{item.legend}</legend>
                                    <div>
                                        <CardComponent
                                            name={item.name}
                                            values={data.fields[item.name]}
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

                    <h1>Individuelle Felder (Maximal 5)</h1>

                    <CardComponentWithName
                        name={"individual"}
                        min={PersonaPersonalityComponent.MIN_INDIVIDUAL}
                        max={PersonaPersonalityComponent.MAX_INDIVIDUAL}
                        values={data.individual}
                        disabled={this.props.disabled}
                        onChanged={this.onIndividualChange}
                        cardComponent={{
                            hideDesc: true,
                            max: PersonaPersonalityComponent.MAX_INDIVIDUAL_CARDS,
                            min: PersonaPersonalityComponent.MIN_INDIVIDUAL_CARDS,
                            counter: new NumberCounter()
                        }}
                    />
                </>
            );
        }
        return (<></>);
    }

    private onIndividualChange = (values: CardComponentFieldsWithName) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-personality"];
            if (data) {
                data.individual = values;
            }
        });
    }

    private applyChanges(type: "demo" | "pain" | "gain" | "state" | "mot", values: CardComponentFields) {
        this.props.saveController.onChanged(save => {
            const data = save.data["persona-personality"];
            if (data) {
                switch (type) {
                    case "demo":
                        data.fields.demograph = values;
                        break;
                    case "pain":
                        data.fields.pains = values;
                        break;
                    case "gain":
                        data.fields.gains = values;
                        break;
                    case "state":
                        data.fields.statements = values;
                        break;
                    case "mot":
                        data.fields.motives = values;
                        break;
                }
            }
        });
    }

}
