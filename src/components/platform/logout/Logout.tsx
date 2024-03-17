import React, {useCallback, useMemo} from "react";
import {Session} from "../../../general-components/Session/Session";
import {RouteComponentProps, withRouter} from "react-router";
import {reload_app} from "../../../index";
import {Loader} from "../../../general-components/Loader/Loader";
import {Messages, useMessageContext} from "../../../general-components/Messages/Messages";

import "./logout.scss";


export function LogoutComponent(props: RouteComponentProps) {

    const {add: addMessage} = useMessageContext();
    const logoutCallback = useCallback(async () => {
        let call = await Session.logout();

        if ((call && call.success) || call?.status === 401) {
            reload_app();

            addMessage("Bis bald!", "SUCCESS", Messages.TIMER);
            props.history.push("/");
        }
    }, [props.history, addMessage]);

    // prevent re-rendering of loader component.
    const payload = useMemo(() => [logoutCallback], [logoutCallback]);

    return (
        <Loader payload={payload} transparent size={120}/>
    );

}

export const Logout = withRouter(LogoutComponent);
