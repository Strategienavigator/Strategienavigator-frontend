import {faBorderAll} from "@fortawesome/free-solid-svg-icons";

import "./utility-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";
import {UtilInvestigationObjectsValues} from "./steps/UtilInvestigationObjects/UtilInvestigationObjectsComponent";
import {UtilWeightingValues} from "./steps/UtilWeighting/UtilWeightingComponent";
import {UtilCriteriasValues} from "./steps/UtilCriterias/UtilCriteriasComponent";
import {UtilEvaluationValues} from "./steps/UtilEvaluation/UtilEvaluationComponent";
import {UtilResultValues} from "./steps/UtilityResult/UtilResultComponent";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import {UtilCriterias} from "./steps/UtilCriterias/UtilCriterias";
import {UtilInvestigationObjects} from "./steps/UtilInvestigationObjects/UtilInvestigationObjects";
import {UtilWeighting} from "./steps/UtilWeighting/UtilWeighting";
import {UtilEvaluation} from "./steps/UtilEvaluation/UtilEvaluation";
import {UtilResult} from "./steps/UtilityResult/UtilResult";


export interface UtilityAnalysisValues {
    "ua-investigation-obj"?: UtilInvestigationObjectsValues,
    "ua-criterias"?: UtilCriteriasValues,
    "ua-weighting"?: UtilWeightingValues,
    "ua-evaluation"?: UtilEvaluationValues,
    "ua-result"?: UtilResultValues
}


/**
 * Hauptklasse der Nutzwertanalyse
 * Hier werden die einzelnen Schritte für die Analyse hinzugefügt
 */
class UtilityAnalysis extends SteppableTool<UtilityAnalysisValues> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Nutzwertanalyse", faBorderAll, 1);

        this.setMaintenance(false);

        this.addExporter(new JSONExporter());

        this.addStep(new UtilInvestigationObjects());
        this.addStep(new UtilCriterias());
        this.addStep(new UtilWeighting());
        this.addStep(new UtilEvaluation());
        this.addStep(new UtilResult());


    }

    protected getInitData(): UtilityAnalysisValues {
        let data: UtilityAnalysisValues = {};
        this.getStep(0).dataHandler.fillFromPreviousValues(data);
        return data;
    }

    protected renderShortDescription(): React.ReactNode {
        return undefined;
    }

    protected renderTutorial(): React.ReactNode {
        return undefined;
    }

}

export {
    UtilityAnalysis
}
