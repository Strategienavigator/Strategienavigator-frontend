import React from "react";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {Accordion} from "react-bootstrap";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import { stringify } from "querystring";

export interface PersonaShowValues {

}
export class PersonaShowComponent extends Step<PersonaAnalysisValues, PersonaShowValues>{

    tempStr:string;

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
        this.tempStr = JSON.stringify(props.save)
    }

    build(): JSX.Element {
        return <div>{this.tempStr}</div>
    }
}