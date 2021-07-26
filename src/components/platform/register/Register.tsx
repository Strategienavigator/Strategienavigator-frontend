import {Component} from "react";
import {Form} from "react-bootstrap";
import {PasswordField} from "../../../general-components/PasswordField";

class Register extends Component<any, any> {

    render() {
        return (
            <Form>
                <PasswordField check={true} />
            </Form>
        );
    }

}

export default Register;