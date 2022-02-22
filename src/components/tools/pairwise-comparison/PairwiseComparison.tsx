import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {PCCriterias, PCCriteriasValues} from "./steps/PCCriterias";
import {PCPairComparison, PCPairComparisonValues} from "./steps/PCPairComparison";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import {SWOTExcelExporter} from "../swot-analysis/export/SWOTExcelExporter";
import {PCExcelExporter} from "./export/PCExcelExporter";
import {PCResult, PCResultValues} from "./steps/PCResult";

import "./pairwise-comparison.scss";

/**
 * Enthält die Werte des Paarweisen-Vergleichs. Umfasst Kriterien und Vergleich
 */
export interface PairwiseComparisonValues {
    "pc-criterias": PCCriteriasValues,
    "pc-comparison": PCPairComparisonValues,
    "pc-result": PCResultValues
}

class PairwiseComparison extends SteppableTool<any> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Paarweiser Vergleich", faSortAmountDownAlt, 3);

        this.setMaintenance(false);

        this.addExporter(new JSONExporter());
        this.addExporter(new PCExcelExporter());

        /*this.addStep({
            form: <PCCriterias/>,
            title: "1. Kritierien festlegen",
            id: "pc-criterias"
        });
        this.addStep({
            form: <PCPairComparison/>,
            title: "2. Paarvergleich",
            id: "pc-comparison"
        });
        this.addStep({
            form: <PCResult/>,
            title: "3. Ergebnis",
            id: "pc-result"
        });*/
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


    protected getInitData(): any {

    }


}

export {
    PairwiseComparison
}
