function compareWithoutFunctions<T extends Object>(oldData: T, newData: T, exclude: string[] = []) {
    let k: keyof T;
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
