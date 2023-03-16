// import {JSONImporter, JSONImporterError} from "../../../../general-components/Import/JSONImporter";
// import SWOTAnalysis_ts from "../SWOTAnalysis-ti";
// import {createCheckers} from "ts-interface-checker";
// import SWOTAlternativeActionsComponent_ts from "../steps/SWOTAlternativeActions/SWOTAlternativeActionsComponent-ti";
// import SWOTClassifyAlternativeActionsComponent_ts
//     from "../steps/SWOTClassifyAlternativeActions/SWOTClassifyAlternativeActionsComponent-ti";
// import PersonaFactorsComponent_ts from "../steps/SWOTFactors/PersonaFactorsComponent_ti";
// import CardComponent_ts from "../../../../general-components/CardComponent/CardComponent-ti";


// class SWOTJSONImporter extends JSONImporter {
//     protected validate(data: object): Promise<void> {
//         let {SWOTAnalysisValues} = createCheckers(
//             SWOTAnalysis_ts,
//             SWOTFactorsComponent_ts,
//             SWOTAlternativeActionsComponent_ts,
//             SWOTClassifyAlternativeActionsComponent_ts,
//             CardComponent_ts
//         );

//         try {
//             SWOTAnalysisValues.check(data);
//         } catch (e) {
//             throw new JSONImporterError();
//         }

//         return Promise.resolve(undefined);
//     }

// }

// export {
//     SWOTJSONImporter
// }
export{
}