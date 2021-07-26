import {FormEvent} from "react";

const extractFromForm = (form: FormEvent<HTMLFormElement>, id: string): string | boolean | null => {
    let target: HTMLFormElement = form.currentTarget;
    let elements = target.elements;
    let input: HTMLInputElement = elements.namedItem(id) as HTMLInputElement;

    if (input === null) {
        return input;
    }
    if (input.type === "checkbox") {
        return input.checked;
    }

    return input.value;
}

export {
    extractFromForm
}