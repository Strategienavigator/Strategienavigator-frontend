/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const PersonaAnalysisValues = t.iface([], {
    "persona-info": "PersonaInfoValues",
    "persona-personality": t.opt("PersonaPersonalityValues"),
    "persona-summary": t.opt("PersonaSummaryValues"),
});

const PersonaAnalysis_ts: t.ITypeSuite = {
    PersonaAnalysisValues,
};
export default PersonaAnalysis_ts;
