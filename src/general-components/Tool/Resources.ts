
export interface ValidatedFile {
    isEmpty: boolean,
    tooBig: boolean,
    notType: boolean
}

/**
 * Prüft, ob die übermittelte Datei gültig ist und validiert diese.
 *
 * @param file Die Datei
 * @param requirements Die Prüfparameter
 */
export const validateFile = (file: File | undefined, requirements: {
    size: number, // in KB
    type: string[]
}): ValidatedFile => {
    let isEmpty, tooBig, notType;
    tooBig = notType = false;
    isEmpty = file === undefined;

    if (!isEmpty && file !== undefined) {
        tooBig = file?.size > (requirements.size * 1000);
        notType = !requirements.type.includes(file.type);
    }

    return {
        isEmpty: isEmpty,
        tooBig: tooBig,
        notType: notType
    }
}