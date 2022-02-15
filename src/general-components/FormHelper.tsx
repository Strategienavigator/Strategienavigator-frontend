import {FormEvent} from "react";
import {CardComponentField, CardComponentFields} from "./CardComponent/CardComponent";
import {CustomDescriptionComponent} from "./CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";


/**
 * Wandelt eine RadioNodeList um in ein Array aus strings
 *
 * @param {RadioNodeList} element die RadioNodeList
 * @returns {Array<string>} Das Array
 */
const getRadioNodeList = <D extends unknown> (element: RadioNodeList): Array<D> => {
    let values = Array<D>();
    element.forEach((value) => {
        let input = value as HTMLInputElement;
        values.push(input.value as D);
    });
    return values;
}

/**
 * Extrahiert CardComponentFields aus einem HTMLFormElement.
 *
 * @param {React.FormEvent<HTMLFormElement>} form HTML-Formular
 * @param {string} name Der Name des input-feldes
 * @param customDesc
 * @returns {CardComponentFields} Array aus CardComponentField, sprich CardComponentFields
 */
const extractCardComponentField = <D extends {} = any>(form: FormEvent<HTMLFormElement>, name: string, customDesc?: CustomDescriptionComponent<any, any, any>) : CardComponentFields<D> => {
    let target: HTMLFormElement = form.currentTarget;
    let elements = target.elements;


    let indexes = new Array<number>();
    let element = elements.namedItem(name + "[][index]");

    if (element) {
        if (element.constructor.name === "HTMLInputElement") {
            indexes.push(Number((element as HTMLInputElement).value));
        } else {
            indexes = getRadioNodeList<number>(element as RadioNodeList);
        }
    }


    let fields: CardComponentFields<D> = [];
    for (const i of indexes) {
        let fieldName = elements.namedItem(name + "[" + i + "][name]") as HTMLInputElement;
        let fieldDesc = elements.namedItem(name + "[" + i + "][desc]") as HTMLInputElement;
        let fieldID = elements.namedItem(name + "[" + i + "][id]") as HTMLInputElement;

        let field = {
            name: fieldName.value,
            desc: fieldDesc.value,
            id: fieldID.value
        };

        if (customDesc) {
            let customField: D = customDesc.extractSingle(i, form);
            field = Object.assign(field, customField);
        }

        fields.push(field as (D & CardComponentField));
    }

    return fields;
}


/**
 * Methode zum Extrahieren von Werten aus verschiedenen HTMLFormElement
 *
 * @param {React.FormEvent<HTMLFormElement>} form
 * @param {string} name
 * @returns {CardComponentFields | Array<string> | string | boolean | null}
 */
const extractFromForm = (form: FormEvent<HTMLFormElement>, name: string): CardComponentFields | Array<string> | string | boolean | RadioNodeList | null => {
    let target: HTMLFormElement = form.currentTarget;
    let elements = target.elements;
    let element: RadioNodeList | Element | null = elements.namedItem(name);

    /*

     RadioNodeList

     */
    if (element?.constructor.name === "RadioNodeList") {
        return element as RadioNodeList;
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
    extractFromForm,
    getRadioNodeList
}
