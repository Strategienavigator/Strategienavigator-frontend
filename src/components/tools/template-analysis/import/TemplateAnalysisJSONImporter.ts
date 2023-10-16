import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";

class TemplateAnalysisJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        let {TemplateAnalysisValues} = createCheckers(
            CardComponent_ts
        );

        try {
            TemplateAnalysisValues.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }

        return Promise.resolve(undefined);
    }

}

export {
    TemplateAnalysisJSONImporter
}