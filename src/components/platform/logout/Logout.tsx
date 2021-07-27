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
            <div className={"loader"}>
                <Spinner className={"spinner"} animation={"border"}/>
            </div>
        );
    }

}

export default withRouter(Logout);