import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {Tool} from "../../../general-components/Tool/Tool";
import {SaveResource} from "../../../general-components/Datastructures";
import {SWOTFactors} from "./steps/SWOTFactors";
import {SWOTAlternativeActions} from "./steps/SWOTAlternativeActions";
import {SWOTClassifyAlternativeActions} from "./steps/SWOTClassifyAlternativeActions";

import "./swot-analysis.scss";


class SWOTAnalysis extends Tool {

    constructor(props: any) {
        super(props);

        this.setID(2);
        this.setToolname("SWOT Analyse");
        this.setToolIcon(faThLarge);

        this.addStep({
            id: "factors",
            title: "1. Faktoren festlegen",
            form: <SWOTFactors/>
        });
        this.addStep({
            id: "alternative-actions",
            title: "2. Handlungsalternativen festlegen",
            form: <SWOTAlternativeActions/>
        });
        this.addStep({
            id: "swot-classify-alternate-actions",
            title: "3. Handlungsalternativen klassifizieren",
            form: <SWOTClassifyAlternativeActions/>
        });
    }

    protected renderToolHome() {
        return null;
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
                Beispiele hierzu wären ein besonders guter Kundenservice oder eine besonders hohe Mitareitermotivation.
                Externe Einflussfaktoren bezeichnen dahingegen <b>"Chancen"</b> und <b>"Risiken"</b>, welche sich nicht
                durch
                das Unternehmen beeinflussen lassen und demzufolge auf eine gesamte Branche oder sogar Markt einwirken.
                Hierzu gehören zum Beispiel Faktoren wie der Klimawandel oder der Digitalisierungsschub durch die
                Corona-Pandemie.
            </p>
        );
    }

    protected renderNew() {
        return this.getStepComponent();
    }

    protected renderView(tool: SaveResource) {
        let data = tool.data;
        return this.getStepComponent({
            values: [
                {
                    id: "factors",
                    values: data
                }
            ]
        });
    }
}

export {
    SWOTAnalysis
}