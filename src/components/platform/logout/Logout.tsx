import React, {Component} from "react";
import {Session} from "../../../general-components/Session/Session";
import {withRouter} from "react-router";
import {reload_app} from "../../../index";
import {Spinner} from "react-bootstrap";

class Logout extends Component<any, any> {

    componentDidMount = async () => {
        let call = await Session.logout();
        if (call.success) {
            reload_app();
            this.props.history.push("/home");
        }
    }

    render() {
        return (
            <h1 className="h3">
                <Spinner animation={"border"}/> Sie werden abgemeldet...
            </h1>
        );
    }

}

export default withRouter(Logout);