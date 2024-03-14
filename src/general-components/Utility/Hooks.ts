import {useCallback, useState} from "react";

/**
 * Hook und ein boolean state zu erstellen. Erstellt höufig genutzen callbacks.
 *
 * Die Referenzen auf die Callbacks ändern sich nicht.
 * @param initialState
 */
export function useBooleanState(initialState: boolean) {
    const [state, setState] = useState(initialState);

    const setTrue = useCallback(function () {
        setState(true);
    }, [setState]);
    const setFalse = useCallback(function () {
        setState(false);
    }, [setState]);
    const toggle = useCallback(function () {
        setState((old) => {
            return !old;
        });
    }, [setState]);

    return {state, setTrue, setFalse, setState, toggle};

}