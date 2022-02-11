function compareWithoutFunctions<T extends Object>(oldData: T, newData: T, exclude = []) {
    let k: keyof T;
    for (k in oldData) {
        const oldValue = oldData[k];
        const newValue = newData[k];
        if (typeof oldValue !== "function" && !(k in exclude)) {
            if(!Object.is(oldValue,newValue)) {
                return false;
            }
        }
    }
    return true;
}

export {
    compareWithoutFunctions
}
