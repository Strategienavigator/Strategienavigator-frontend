/**
 * Gibt true zurück wenn newData identisch mit oldData ist
 * @param oldData
 * @param newData
 * @param exclude
 */
function compareWithoutFunctions<T extends Object>(oldData: T, newData: T, exclude: string[] = []) {
    let k: keyof T;
    if(oldData === newData){
        return true;
    }
    for (k in oldData) {
        const oldValue = oldData[k];
        const newValue = newData[k];
        if (typeof oldValue !== "function" && !(exclude.some(e => e === k))) {
            if (!Object.is(oldValue, newValue)) {
                return false;
            }
        }
    }
    return true;
}

export {
    compareWithoutFunctions
}
