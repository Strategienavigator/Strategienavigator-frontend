import React, {Component} from "react";
import {Session} from "../../../general-components/Session/Session";
import {withRouter} from "react-router";
import {reload_app} from "../../../index";
import {Loader} from "../../../general-components/Loader/Loader";
import {Messages} from "../../../general-components/Messages/Messages";

import "./logout.scss";


export class LogoutComponent extends Component<any, any> {

    logout = async () => {
        let call = await Session.logout();
        if (call && call.success || call?.status === 401) {
            reload_app();

            Messages.add("Bis bald!", "SUCCESS", Messages.TIMER);
            this.props.history.push("/");
        }
    }

    render() {
        return (
            <Loader payload={[this.logout]} transparent size={120}/>
        );
    }

}

export const Logout = withRouter(LogoutComponent);
