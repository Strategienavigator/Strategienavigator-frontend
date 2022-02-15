import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SaveResource} from "../../../general-components/Datastructures";
import {PCCriterias, PCCriteriasValues} from "./steps/PCCriterias";
import {PCPairComparison, PCPairComparisonValues} from "./steps/PCPairComparison";

import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
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

/**
 * Der Paarweise-Vergleich
 */
class PairwiseComparison extends SteppableTool {

    /**
     * Setzt die Grundinformationen für den Paarweisen-Vergleich fest und legt damit den Grundstein.
     * Fügt die Schritte und die Exporter hinzu.
     *
     * @param props React Props
     */
    constructor(props: any) {
        super(props);

        this.setID(3);
        this.setToolname("Paarweiser Vergleich");
        this.setToolIcon(faSortAmountDownAlt);
        this.setMaintenance(false);

        this.addExporter(new JSONExporter());
        this.addExporter(new PCExcelExporter());

        this.addStep({
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

    /**
     * Baut den Paarweisen Vergleich aus einem Speicherstand auf
     *
     * @param {SaveResource<PairwiseComparisonValues>} save Der Speicherstand
     * @returns {JSX.Element} StepComponent
     * @protected
     */
    protected renderView(save: SaveResource<PairwiseComparisonValues>) {
        this.setValues("pc-criterias", save.data["pc-criterias"]);
        this.setValues("pc-comparison", save.data["pc-comparison"]);
        this.setValues("pc-result", save.data["pc-result"]);

        return this.getStepComponent();
    }
}

export {
    PairwiseComparison
}
