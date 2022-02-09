import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {SwotFactorsValues} from "./steps/SWOTFactors/SWOTFactorsComponent";
import {SWOTAlternativeActionsValues} from "./steps/SWOTAlternativeActions/SWOTAlternativeActionsComponent";
import {
    SWOTClassifyAlternativeActionsValues
} from "./steps/SWOTClassifyAlternativeActions/SWOTClassifyAlternativeActionsComponent";

import "./swot-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import {SWOTExcelExporter} from "./export/SWOTExcelExporter";
import {RouteComponentProps} from "react-router";
import {SWOTFactors} from "./steps/SWOTFactors/SWOTFactors";
import {SaveResource} from "../../../general-components/Datastructures";
import {SWOTAlternativeActions} from "./steps/SWOTAlternativeActions/SWOTAlternativeActions";


interface SWOTAnalysisValues {
    "swot-factors"?: SwotFactorsValues,
    "alternative-actions"?: SWOTAlternativeActionsValues,
    "swot-classify-alternate-actions"?: SWOTClassifyAlternativeActionsValues
}
class SWOTAnalysis extends SteppableTool<SWOTAnalysisValues> {

    constructor(props: RouteComponentProps<{ id: string }>, context: any) {
        super(props, context, "SWOT Analyse", faThLarge, 2);

        this.addExporter(new JSONExporter());
        this.addExporter(new SWOTExcelExporter());

        this.addStep(new SWOTFactors());
        this.addStep(new SWOTAlternativeActions())
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

    protected getInitData(): SWOTAnalysisValues {
        let data: SWOTAnalysisValues = {};
        data = this.getStep(0).dataHandler.fillFromPreviousValues(data);
        return data;
    }

}

export {
    SWOTAnalysis
}

export type {
    SWOTAnalysisValues
}
