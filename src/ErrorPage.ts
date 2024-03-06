import {useCallback} from "react";
import {matchPath} from "react-router-dom";
import {useHistory} from "react-router";
import { History,LocationState} from "history";

export type ErrorPageChanger = (code: number, callback?: (...args: any) => any) => void
export function showErrorPage(history: History<LocationState>, code: number, callback?: (...args: any) => any) {

    if (!matchPath(document.location.pathname, {
        exact: true,
        path: "/error/:id"
    })) {
        history.push("/error/" + code);
    }

    if (callback) {
        callback(callback?.arguments);
    }
}

export function useErrorPageFunction():ErrorPageChanger {
    const history = useHistory();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(showErrorPage.bind(null, history), [history]);
}
