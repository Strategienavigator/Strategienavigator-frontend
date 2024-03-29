/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const ClassifiedAlternateAction = t.iface([], {
    "name": "string",
    "index": "number",
    "indexName": "string",
    "alreadyAdded": "boolean",
    "action": "CardComponentField",
});

export const ClassificationValues = t.iface([], {
    "droppableID": "string",
    "name": "string",
    "actions": t.array("ClassifiedAlternateAction"),
});

export const SWOTClassifyAlternativeActionsValues = t.iface([], {
    "classifications": t.array("ClassificationValues"),
    "actions": t.array("ClassifiedAlternateAction"),
});

const SWOTClassifyAlternativeActionsComponent_ts: t.ITypeSuite = {
    ClassifiedAlternateAction,
    ClassificationValues,
    SWOTClassifyAlternativeActionsValues,
};
export default SWOTClassifyAlternativeActionsComponent_ts;
