/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const Rating = t.iface([], {
    "criteriaIndex": "number",
    "rating": "CompareComponentValues",
});

export const PortEvaluationValues = t.iface([], {
    "attractivity": t.array("Rating"),
    "comp-standing": t.array("Rating"),
});

const PortEvaluationComponent_ts: t.ITypeSuite = {
    Rating,
    PortEvaluationValues,
};
export default PortEvaluationComponent_ts;
