/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const SWOTAnalysisValues = t.iface([], {
    "swot-factors": "SwotFactorsValues",
    "alternative-actions": t.opt("SWOTAlternativeActionsValues"),
    "swot-classify-alternate-actions": t.opt("SWOTClassifyAlternativeActionsValues"),
});

const SWOTAnalysis_ts: t.ITypeSuite = {
    SWOTAnalysisValues,
};
export default SWOTAnalysis_ts;
