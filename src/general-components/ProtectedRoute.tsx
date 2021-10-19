import {Redirect, RouteProps} from "react-router";
import {Route} from "react-router-dom";
import {Session} from "./Session/Session";


interface ProtectedRouteProps extends RouteProps {
    loggedIn?: boolean | undefined
}

function ProtectedRoute(props: ProtectedRouteProps) {

    if (props.loggedIn !== undefined) {
        if (props.loggedIn === Session.isLoggedIn()) {

        } else if (props.loggedIn) {
            return (
                <Redirect to={"/login"}/>
            );
        } else {
            return (
                <Redirect to={"/"}/>
            );
        }
    }

    return (
        <Route {...props} />
    );
}

export {
    ProtectedRoute
}
