import {faSortAmountDownAlt} from "@fortawesome/free-solid-svg-icons";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
import "./pairwise-comparison.scss";
import {PCPairComparisonValues} from "./steps/PCPairComparison/PCPairComparisonComponent";
import {PCResultValues} from "./steps/PCResult/PCResultComponent";
import {PCCriterias} from "./steps/PCCriterias/PCCriterias";
import {PCPairComparison} from "./steps/PCPairComparison/PCPairComparison";
import {PCResult} from "./steps/PCResult/PCResult";
import {PCExcelExporter} from "./export/PCExcelExporter";
import {PCCriteriasValues} from "./steps/PCCriterias/PCCriteriasComponent";

/**
 * Enthält die Werte des Paarweisen-Vergleichs. Umfasst Kriterien und Vergleich
 */
export interface PairwiseComparisonValues {
    "pc-criterias"?: PCCriteriasValues,
    "pc-comparison"?: PCPairComparisonValues,
    "pc-result"?: PCResultValues
}

class PairwiseComparison extends SteppableTool<PairwiseComparisonValues> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Paarweiser Vergleich", faSortAmountDownAlt, 3);

        this.setMaintenance(false);

        this.addExporter(new JSONExporter());
        this.addExporter(new PCExcelExporter());

        this.addStep(new PCCriterias());
        this.addStep(new PCPairComparison());
        this.addStep(new PCResult());
    }

    protected getInitData(): PairwiseComparisonValues {
        const data: PairwiseComparisonValues = {};

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
    PairwiseComparison
}
