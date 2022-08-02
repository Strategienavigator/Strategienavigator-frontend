/**
 * Wandelt eine RadioNodeList um in ein Array aus strings
 *
 * @param {RadioNodeList} element die RadioNodeList
 * @returns {Array<string>} Das Array
 */
import React, {FormEvent, ReactNode} from "react";
import {CardComponentFields} from "./CardComponent/CardComponent";


/**
 * Führt den callback für alle ReactNodes und ihre kinder aus.
 *
 * @param roots
 * @param func
 */
function forEachChildrenRecursively(roots: ReactNode[], func: (node: ReactNode) => void) {
    React.Children.forEach(roots, (value => {

        if (React.isValidElement(value)) {
            if ("children" in value.props) {
                forEachChildrenRecursively(value.props.children, func);
            }
        }
    }));
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
    extractFromForm,
    forEachChildrenRecursively
}
