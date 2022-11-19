/**
 * Gibt true zurück wenn newData identisch mit oldData ist
 * @param oldData
 * @param newData
 * @param exclude
 */
function compareWithoutFunctions<T extends Object>(oldData: T, newData: T, exclude: string[] = []) {
    let k: keyof T;

    if (oldData === newData) {
        return true;
    }

    const excludeCheck = (k: string): boolean => {
        return exclude.some((e) => {
            return e === k;
        });
    }

    for (k in oldData) {
        const oldValue = oldData[k];
        const newValue = newData[k];

        if (
            typeof oldValue !== "function" &&
            !excludeCheck(k)
        ) {
            if (!Object.is(oldValue, newValue)) {
                return false;
            }
        }
    }
    return true;
}

function isEmpty(s: string) {
    return !(s && s !== "" && s.length !== 0);
}

export {
    compareWithoutFunctions,
    isEmpty
}
