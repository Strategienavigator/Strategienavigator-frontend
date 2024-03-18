import React, {useEffect} from "react";
import {Loader} from "../../../general-components/Loader/Loader";

import "./logout.scss";
import {useUserContext} from "../../../general-components/Contexts/UserContextComponent";
import {RouteComponentProps, useHistory, withRouter} from "react-router";


export function LogoutComponent(props: RouteComponentProps) {

    const {isLoggedIn} = useUserContext();
    const history = useHistory()
    useEffect(() => {
        if (!isLoggedIn) {
            history.push("/");
        }
    }, [isLoggedIn, history]);


    return (
        <Loader loaded={false} transparent size={120}/>
    );

}

export const Logout = withRouter(LogoutComponent);
