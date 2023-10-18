import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";

class TestAnalysisJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {TestAnalysisValues} = createCheckers(
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