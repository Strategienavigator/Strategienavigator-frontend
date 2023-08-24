import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";


class PersonaJSONImporter extends JSONImporter {
    protected validate(data: object): Promise<void> {
        let {PersonaAnalysisValues} = createCheckers(
        );

        try {
            PersonaAnalysisValues.check(data);
        } catch (e) {
            throw new JSONImporterError();
        }

        return Promise.resolve(undefined);
    }

}

export {
    PersonaJSONImporter
}