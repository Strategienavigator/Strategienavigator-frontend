import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import PersonaAnalysis_ts from "../PersonaAnalysis-ti";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import PersonaInfoComponent_ts from "../steps/PersonaInfo/PersonaInfoComponent-ti";
import PersonaPersonalityComponent_ts from "../steps/PersonaPersonality/PersonaPersonalityComponent-ti";
import PersonaSummary_ts from "../steps/PersonaSummary/PersonaSummaryComponent-ti";


class PersonaJSONImporter extends JSONImporter {
    protected validate(data: object): Promise<void> {
        let {PersonaAnalysisValues} = createCheckers(
            PersonaAnalysis_ts,
            PersonaInfoComponent_ts,
            PersonaPersonalityComponent_ts,
            PersonaSummary_ts,
            CardComponent_ts
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