/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const PersonaInfoValues = t.iface([], {
    "firstname": t.union("string", "null"),
    "lastname": t.union("string", "null"),
    "age": t.union("number", "null")
});

const PersonaInfoComponent_ts: t.ITypeSuite = {
    PersonaInfoValues
};
export default PersonaInfoComponent_ts;
