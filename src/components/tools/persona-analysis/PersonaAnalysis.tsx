import {faUserCircle} from "@fortawesome/free-solid-svg-icons";

import "./persona-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import {RouteComponentProps} from "react-router";
import {PersonaJSONImporter} from "./import/PersonaJSONImporter";
import {PersonaInfoValues} from "./steps/PersonaInfo/PersonaInfoComponent";
import {PersonaInfo} from "./steps/PersonaInfo/PersonaInfo";
import {PersonaPersonalityValues} from "./steps/PersonaPersonality/PersonaPersonalityComponent";
import {PersonaPersonality} from "./steps/PersonaPersonality/PersonaPersonality";
import {PersonaSummaryValues} from "./steps/PersonaSummary/PersonaSummaryComponent";
import {PersonaSummary} from "./steps/PersonaSummary/PersonaSummary";


interface PersonaAnalysisValues {
    "persona-info"?: PersonaInfoValues,
    "persona-personality"?: PersonaPersonalityValues,
    "persona-summary"?: PersonaSummaryValues
}

class PersonaAnalysis extends SteppableTool<PersonaAnalysisValues> {

    constructor(props: RouteComponentProps<{ id: string }>, context: any) {
        super(props, context, "Persona Analyse", faUserCircle, 6);

        this.addExporter(new JSONExporter());
        this.setImporter(new PersonaJSONImporter());

        this.addStep(new PersonaInfo());
        this.addStep(new PersonaPersonality())
        this.addStep(new PersonaSummary());
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return null;
    }

    protected getInitData(): PersonaAnalysisValues {
        let data = {
            "persona-info": undefined,
            "persona-personality": undefined,
            "persona-summary": undefined
        };
        this.getStep(0).dataHandler.deleteData(data);
        return data;
    }

}

export {
    PersonaAnalysis
}

export type {
    PersonaAnalysisValues
}
