import {FormEvent} from "react";
import {CardComponentFields} from "./CardComponent/CardComponent";


const getRadioNodeList = (element: RadioNodeList): Array<string> => {
    let values = Array<string>();
    element.forEach((value) => {
        let input = value as HTMLInputElement;
        values.push(input.value);
    });
    return values;
}

const extractCardComponentField = (form: FormEvent<HTMLFormElement>, name: string) => {
    let target: HTMLFormElement = form.currentTarget;
    let elements = target.elements;

    let names: RadioNodeList | Element | null = elements.namedItem(name + "[][name]");
    let descs: RadioNodeList | Element | null = elements.namedItem(name + "[][desc]");
    let ids: RadioNodeList | Element | null = elements.namedItem(name + "[][id]")

    if (names !== null && descs !== null) {
        if (names.constructor.name !== "RadioNodeList") {
            if (names as HTMLInputElement !== null) {
                return [{
                    desc: (descs as HTMLInputElement).value,
                    name: (names as HTMLInputElement).value,
                    id: (ids as HTMLInputElement).value
                }];
            }
        } else {
            let allNames = getRadioNodeList(names as RadioNodeList);
            let allDescs = getRadioNodeList(descs as RadioNodeList);
            let allIDs = getRadioNodeList(ids as RadioNodeList);

            let cardFields: CardComponentFields = [];
            for (let i = 0; i < allNames.length; i++) {
                cardFields.push({
                    desc: allDescs[i],
                    name: allNames[i],
                    id: allIDs[i]
                });
            }
            return cardFields;
        }
    }
    return [];
}

const extractFromForm = (form: FormEvent<HTMLFormElement>, name: string): CardComponentFields | Array<string> | string | boolean | null => {
    let target: HTMLFormElement = form.currentTarget;
    let elements = target.elements;
    let element: RadioNodeList | Element | null = elements.namedItem(name);

    /*

     RadioNodeList

     */
    if (element?.constructor.name === "RadioNodeList") {
        return getRadioNodeList(element as RadioNodeList);
    }

    let input = element as HTMLInputElement;
    /*

     null

     */
    if (input === null) {
        return input;
    }
    /*

     Checkbox

     */
    if (input.type === "checkbox") {
        return input.checked;
    }

    /*

     value

     */
    return input.value;
}

export {
    extractCardComponentField,
    extractFromForm
}
