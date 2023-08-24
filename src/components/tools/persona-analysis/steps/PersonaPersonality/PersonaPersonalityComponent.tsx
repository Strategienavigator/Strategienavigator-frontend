import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";


export interface PersonaPersonalityValues {
    citations: CardComponentFields;
    [key: string]: CardComponentFields;
}

export class PersonaPersonalityComponent extends Step<PersonaAnalysisValues, {}> {

    static DEFAULT_MIN = 1;
    static DEFAULT_MAX = 8;

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

    // Change listener
    private citationsChanged = this.applyChanges.bind(this, "cit");

    static COUNTER = new NumberCounter();

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let data = this.props.save.data["persona-personality"];

        if (data) {
            return (
                <>
                    <fieldset>
                        <legend>
                            Zitate und Sprüche
                        </legend>
                        <div>
                            <CardComponent
                                name={"citations"}
                                values={data.citations}
                                disabled={this.props.disabled}
                                min={PersonaPersonalityComponent.MIN_CITATION}
                                max={PersonaPersonalityComponent.MAX_CITATION}
                                counter={PersonaPersonalityComponent.COUNTER}
                                hideDesc={true}
                                required={true}
                                onChanged={this.citationsChanged}
                            />
                            <UIErrorBanner id={"citations.empty"} />
                            <UIErrorBanner id={"citations.toolong"} />
                        </div>
                    </fieldset>
                </>
            );
        }
        return (<></>);
    }

    private applyChanges(type: "cit", values: CardComponentFields) {
        this.props.saveController.onChanged(save => {
           const data = save.data["persona-personality"];
           if (data) {
               switch (type) {
                   case "cit":
                       data.citations = values;
                       break;
               }
           }
        });
    }

}
