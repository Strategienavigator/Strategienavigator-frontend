import {Component} from "react";
import {Form} from "react-bootstrap";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";

import "./register.scss";

class Register extends Component<any, any> {

    render() {
        return (
            <Form className={"registerContainer"}>
                <PasswordField check={true} eye={true}/>
            </Form>
        );
    }

}

export default Register;