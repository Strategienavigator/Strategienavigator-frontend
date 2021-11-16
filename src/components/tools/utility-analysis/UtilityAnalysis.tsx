import {faBorderAll} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {UtilInvestigationObjects} from "./steps/UtilInvestigationObjects";
import {UtilWeighting} from "./steps/UtilWeighting";
import {UtilCriterias} from "./steps/UtilCriterias";
import {UtilEvaluation} from "./steps/UtilEvaluation";
import {UtilResult} from "./steps/UtilResult";

import "./utility-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";


class UtilityAnalysis extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(1);
        this.setToolname("Nutzwertanalyse");
        this.setToolIcon(faBorderAll);
        this.setMaintenance(true);

        this.addStep({
            id: "utility-objects",
            title: "1. Untersuchungsobjekte",
            form: <UtilInvestigationObjects/>
        });
        this.addStep({
            id: "utility-criterias",
            title: "2. Kriterien",
            form: <UtilCriterias/>
        });
        this.addStep({
            id: "utility-weighting",
            title: "3. Gewichtung",
            form: <UtilWeighting/>
        });
        this.addStep({
            id: "utility-evaluation",
            title: "4. Bewertung > Objekt nach Kriterien",
            form: <UtilEvaluation/>
        });
        this.addStep({
            id: "utility-result",
            title: "4. Bewertungsübersicht",
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

    protected renderView(tool: SaveResource) {
        return this.getStepComponent();
    }
}

export {
    UtilityAnalysis
}
