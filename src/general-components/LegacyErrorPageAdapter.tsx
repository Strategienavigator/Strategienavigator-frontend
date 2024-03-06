import {ErrorPageChanger, useErrorPageFunction} from "../ErrorPage";
import {useEffect} from "react";


const listeners: ErrorPageChanger[] = [];

function AddErrorPageListeners(listener: ErrorPageChanger): void {
    listeners.push(listener);
}

function RemoveErrorPageListeners(listener: ErrorPageChanger): void {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
}

/**
 * @deprecated use hook or function with history as argument.
 */
export function legacyShowErrorPage(code: number, callback?: (...args: any) => any) {
    for (const listener of listeners) {
        listener.call(null, code, callback);
    }
}


export function LegacyErrorPageAdapter() {
    const renderErrorPage = useErrorPageFunction()

    useEffect(() => {
        AddErrorPageListeners(renderErrorPage);
        return () => {
            RemoveErrorPageListeners(renderErrorPage);
        }
    }, [renderErrorPage]);
    return null;

}

