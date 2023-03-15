import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import ResultEvaluation_ts from "../../../../general-components/EvaluationComponent/Result/ResultEvaluation-ti";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import CompareComponent_ts from "../../../../general-components/CompareComponent/CompareComponent-ti";
import CompareHeaderAdapter_ts from "../../../../general-components/CompareComponent/Header/CompareHeaderAdapter-ti";
import UtilityAnalysis_ts from "../UtilityAnalysis-ti";
import UtilInvestigationObjectsComponent_ts
    from "../steps/UtilInvestigationObjects/UtilInvestigationObjectsComponent-ti";
import UtilCriteriasComponent_ts from "../steps/UtilCriterias/UtilCriteriasComponent-ti";
import UtilEvaluationComponent_ts from "../steps/UtilEvaluation/UtilEvaluationComponent-ti";
import UtilResultComponent_ts from "../steps/UtilityResult/UtilResultComponent-ti";
import UtilWeightingComponent_ts from "../steps/UtilWeighting/UtilWeightingComponent-ti";


class UtilityJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {UtilityAnalysisValues} = createCheckers(
            UtilityAnalysis_ts,
            UtilInvestigationObjectsComponent_ts,
            UtilCriteriasComponent_ts,
            UtilEvaluationComponent_ts,
            UtilResultComponent_ts,
            UtilWeightingComponent_ts,
            ResultEvaluation_ts,
            CardComponent_ts,
            CompareComponent_ts,
            CompareHeaderAdapter_ts
        );
        try {
            UtilityAnalysisValues.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }
        return Promise.resolve(undefined);
    }

}

export {
    UtilityJSONImporter
}