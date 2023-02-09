import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import PortfolioAnalysis_ts from "../PortfolioAnalysis-ti";
import {createCheckers} from "ts-interface-checker";
import PortObjectsComponent_ts from "../steps/PortObjects/PortObjectsComponent-ti";
import PortCriteriasComponent_ts from "../steps/PortCriterias/PortCriteriasComponent-ti";
import CompareHeaderAdapter_ts from "../../../../general-components/CompareComponent/Header/CompareHeaderAdapter-ti";
import CompareComponent_ts from "../../../../general-components/CompareComponent/CompareComponent-ti";
import PortWeightingComponent_ts from "../steps/PortWeighting/PortWeightingComponent-ti";
import PortEvaluationComponent_ts from "../steps/PortEvaluation/PortEvaluationComponent-ti";
import ResultEvaluation_ts from "../../../../general-components/EvaluationComponent/Result/ResultEvaluation-ti";
import PortResultComponent_ts from "../steps/PortResult/PortResultComponent-ti";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import Point_ts from "../../../../general-components/CoordinateSystem/Point/Point-ti";


class PortJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {PortfolioAnalysisValues} = createCheckers(
            PortfolioAnalysis_ts,
            PortObjectsComponent_ts,
            PortCriteriasComponent_ts,
            PortWeightingComponent_ts,
            PortEvaluationComponent_ts,
            PortResultComponent_ts,
            ResultEvaluation_ts,
            Point_ts,
            CardComponent_ts,
            CompareComponent_ts,
            CompareHeaderAdapter_ts
        );
        try {
            PortfolioAnalysisValues.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }
        return Promise.resolve(undefined);
    }

}

export {
    PortJSONImporter
}