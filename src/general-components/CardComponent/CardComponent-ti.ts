/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const CardComponentField = t.iface([], {
  "name": "string",
  "desc": "string",
  "id": t.union("string", "null"),
  "extra": t.opt("any"),
});

export const CardComponentFields = t.array("CardComponentField");

export const CardComponentFieldPlaceholder = t.iface([], {
  "description": t.opt("string"),
  "name": t.opt("string"),
});

const CardComponent_ts: t.ITypeSuite = {
  CardComponentField,
  CardComponentFields,
  CardComponentFieldPlaceholder
};
export default CardComponent_ts;