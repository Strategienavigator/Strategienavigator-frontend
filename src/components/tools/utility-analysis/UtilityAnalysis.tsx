import {faBorderAll} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {UtilInvestigationObjects, UtilInvestigationObjectsValues} from "./steps/UtilInvestigationObjects";
import {UtilWeighting, UtilWeightingValues} from "./steps/UtilWeighting";
import {UtilCriterias, UtilCriteriasValues} from "./steps/criterias/UtilCriterias";
import {UtilEvaluation, UtilEvaluationValues} from "./steps/UtilEvaluation";
import {UtilResult, UtilResultValues} from "./steps/UtilResult";

import "./utility-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";


export interface UtilityAnalysisValues {
    "ua-investigation-obj": UtilInvestigationObjectsValues,
    "ua-criterias": UtilCriteriasValues,
    "ua-weighting": UtilWeightingValues,
    "ua-evaluation": UtilEvaluationValues,
    "ua-result": UtilResultValues
}

class UtilityAnalysis extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(1);
        this.setToolname("Nutzwertanalyse");
        this.setToolIcon(faBorderAll);
        this.setMaintenance(false);

        this.addExporter(new JSONExporter());

        this.addStep({
            id: "ua-investigation-obj",
            title: "1. Untersuchungsobjekte",
            form: <UtilInvestigationObjects/>
        });
        this.addStep({
            id: "ua-criterias",
            title: "2. Kriterien",
            form: <UtilCriterias/>
        });
        this.addStep({
            id: "ua-weighting",
            title: "3. Gewichtung",
            form: <UtilWeighting/>
        });
        this.addStep({
            id: "ua-evaluation",
            title: "4. Bewertung > Objekt nach Kriterien",
            form: <UtilEvaluation/>
        });
        this.addStep({
            id: "ua-result",
            title: "5. Bewertungsübersicht",
            form: <UtilResult/>
        });
    }

    protected renderToolHome() {
        return null;
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return null;
    }

    protected renderView(save: SaveResource<UtilityAnalysisValues>) {
        this.setValues("ua-investigation-obj", save.data["ua-investigation-obj"])
        this.setValues("ua-criterias", save.data["ua-criterias"]);
        this.setValues("ua-weighting", save.data["ua-weighting"]);
        this.setValues("ua-evaluation", save.data["ua-evaluation"]);
        this.setValues("ua-result", save.data["ua-result"]);

        return this.getStepComponent();
    }
}

export {
    UtilityAnalysis
}
