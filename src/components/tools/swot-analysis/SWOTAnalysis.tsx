import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {SWOTFactors, SwotFactorsValues} from "./steps/SWOTFactors";
import {SWOTAlternativeActions, SWOTAlternativeActionsValues} from "./steps/SWOTAlternativeActions";
import {
    SWOTClassifyAlternativeActions,
    SWOTClassifyAlternativeActionsValues
} from "./steps/SWOTClassifyAlternativeActions/SWOTClassifyAlternativeActions";

import "./swot-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {SWOTAnalysisMatrix} from "./matrix/SWOTAnalysisMatrix";


interface SWOTAnalysisValues {
    "swot-factors": SwotFactorsValues,
    "alternative-actions": SWOTAlternativeActionsValues,
    "swot-classify-alternate-actions": SWOTClassifyAlternativeActionsValues
}

class SWOTAnalysis extends SteppableTool {

    constructor(props: any) {
        super(props);

        this.setID(2);
        this.setToolname("SWOT Analyse");
        this.setToolIcon(faThLarge);
        this.setMatrix(<SWOTAnalysisMatrix steps={[2]} />);

        this.addStep<SwotFactorsValues>({
            id: "swot-factors",
            title: "1. Faktoren festlegen",
            form: <SWOTFactors/>
        });
        this.addStep<SWOTAlternativeActionsValues>({
            id: "alternative-actions",
            title: "2. Handlungsalternativen festlegen",
            form: <SWOTAlternativeActions/>
        });
        this.addStep<SWOTClassifyAlternativeActionsValues>({
            id: "swot-classify-alternate-actions",
            title: "3. Handlungsalternativen klassifizieren",
            form: <SWOTClassifyAlternativeActions/>
        });
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return (
            <p>
                Eine gute SWOT-Analyse kombiniert sowohl <b>interne Einflussfaktoren</b> als auch <b>externe
                Einflussfaktoren</b>.
                Interne Einflussfaktoren zeichnen sich in erster Linie dadurch aus, dass sie sich direkt durch
                das Unternehmen beeinflussen lassen. Folglich spricht man hier auch
                von <b>"Stärken"</b> und <b>"Schwächen"</b>.
                Beispiele hierzu wären ein besonders guter Kundenservice oder eine besonders hohe Mitarbeitermotivation.
                Externe Einflussfaktoren bezeichnen dahingegen <b>"Chancen"</b> und <b>"Risiken"</b>, welche sich nicht
                durch
                das Unternehmen beeinflussen lassen und demzufolge auf eine gesamte Branche oder sogar Markt einwirken.
                Hierzu gehören zum Beispiel Faktoren wie der Klimawandel oder der Digitalisierungsschub durch die
                Corona-Pandemie.
            </p>
        );
    }

    protected renderView(save: SaveResource<SWOTAnalysisValues>) {
        this.setValues("swot-factors", save.data["swot-factors"]);
        this.setValues("alternative-actions", save.data["alternative-actions"]);
        this.setValues("swot-classify-alternate-actions", save.data["swot-classify-alternate-actions"]);

        return this.getStepComponent();
    }
}

export {
    SWOTAnalysis
}
