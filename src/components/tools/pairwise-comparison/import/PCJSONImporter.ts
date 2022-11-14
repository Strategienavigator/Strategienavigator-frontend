import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import PairwiseComparison_ts from "../PairwiseComparison-ti";
import PCCriteriasComponent_ts from "../steps/PCCriterias/PCCriteriasComponent-ti";
import WeightingEvaluation_ts
    from "../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation-ti";
import CompareComponent_ts from "../../../../general-components/CompareComponent/CompareComponent-ti";
import PCPairComparisonComponent_ts from "../steps/PCPairComparison/PCPairComparisonComponent-ti";
import PCResultComponent_ts from "../steps/PCResult/PCResultComponent-ti";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import CompareHeaderAdapter_ts from "../../../../general-components/CompareComponent/Header/CompareHeaderAdapter-ti";


class PCJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {PairwiseComparisonValues_ti} = createCheckers(
            PairwiseComparison_ts,
            PCCriteriasComponent_ts,
            PCPairComparisonComponent_ts,
            PCResultComponent_ts,
            WeightingEvaluation_ts,
            CompareComponent_ts,
            CardComponent_ts,
            CompareHeaderAdapter_ts
        );
        try {
            PairwiseComparisonValues_ti.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }
        return Promise.resolve(undefined);
    }

}

export {
    PCJSONImporter
}