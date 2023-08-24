import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";


export interface PersonaPersonalityValues {
}

export class PersonaPersonalityComponent extends Step<PersonaAnalysisValues, {}> {

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        return <p>"ERROR"</p>;
    }

}
