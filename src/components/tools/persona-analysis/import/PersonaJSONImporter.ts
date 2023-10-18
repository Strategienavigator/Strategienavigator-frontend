import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
import {createCheckers} from "ts-interface-checker";
import PersonaAnalysis_ts from "../PersonaAnalysis-ti";
import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";
import PersonaInfo_ts from "../steps/PersonaInfo/PersonaInfoComponent-ti";
import PersonaSummary_ts from "../steps/PersonaSummary/PersonaSummaryComponent-ti";
import PersonaPersonality_ts from "../steps/PersonaPersonality/PersonaPersonalityComponent-ti";
import CardComponentWithName_ts from "../../../../general-components/CardComponent/CardComponentWithName-ti";


class PersonaJSONImporter extends JSONImporter {
    protected validate(data: object): Promise<void> {
        let {PersonaAnalysisValues} = createCheckers(
            PersonaAnalysis_ts,
            PersonaInfo_ts,
            PersonaPersonality_ts,
            PersonaSummary_ts,
            CardComponent_ts,
            CardComponentWithName_ts
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