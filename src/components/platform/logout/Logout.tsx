import React, {useCallback} from "react";
import {Session} from "../../../general-components/Session/Session";
import {RouteComponentProps, withRouter} from "react-router";
import {reload_app} from "../../../index";
import {Loader} from "../../../general-components/Loader/Loader";
import {Messages} from "../../../general-components/Messages/Messages";

import "./logout.scss";


export function LogoutComponent(props: RouteComponentProps) {

    const logoutCallback = useCallback(async () => {
        let call = await Session.logout();

        if ((call && call.success) || call?.status === 401) {
            reload_app();

            Messages.add("Bis bald!", "SUCCESS", Messages.TIMER);
            props.history.push("/");
        }
    }, [props.history]);

    return (
        <Loader payload={[logoutCallback]} transparent size={120}/>
    );

}

export const Logout = withRouter(LogoutComponent);
