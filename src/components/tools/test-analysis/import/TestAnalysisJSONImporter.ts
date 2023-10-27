import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import TestSubstepsComponent_ts from "../steps/TestSubsteps/TestSubstepsComponent-ti";
import TestResourcesComponent_ts from "../steps/TestResources/TestResourcesComponent-ti";
import TestCoordinateSystemComponent_ts from "../steps/TestCoordinateSystem/TestCoordinateSystemComponent-ti";
import TestCardcomponentComponent_ts from "../steps/TestCardcomponent/TestCardcomponentComponent-ti";
import TestAnalysis_ts from "../TestAnalysis-ti";
import TestComparecomponent_ts from "../steps/TestComparecomponent/TestComparecomponentComponent-ti";
import Point_ts from "../../../../general-components/CoordinateSystem/Point/Point-ti";
import CompareComponent_ts from "../../../../general-components/CompareComponent/CompareComponent-ti";
import CompareHeaderAdapter_ts from "../../../../general-components/CompareComponent/Header/CompareHeaderAdapter-ti";

class TestAnalysisJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {TestAnalysisValues} = createCheckers(
            TestAnalysis_ts,
            TestComparecomponent_ts,
            TestCardcomponentComponent_ts,
            TestSubstepsComponent_ts,
            TestResourcesComponent_ts,
            Point_ts,
            CompareComponent_ts,
            CompareHeaderAdapter_ts,
            TestCoordinateSystemComponent_ts,
            CardComponent_ts
        );

        try {
            TestAnalysisValues.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }

        return Promise.resolve(undefined);
    }

}

export {
    TestAnalysisJSONImporter
}