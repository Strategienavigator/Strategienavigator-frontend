import React, {Component} from "react";
import {Session} from "../../../general-components/Session/Session";
import {withRouter} from "react-router";
import {reload_app} from "../../../index";
import Loader from "../../../general-components/Loader/Loader";

class Logout extends Component<any, any> {

    logout = async () => {
        let call = await Session.logout();
        if (call.success) {
            reload_app();
            this.props.history.push("/home");
        }
    }

    render() {
        return (
            <Loader payload={[this.logout]} transparent size={120}/>
        );
    }

}

export default withRouter(Logout);