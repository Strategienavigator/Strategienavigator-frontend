import React, {Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";

import "./register.scss";
import {extractFromForm} from "../../../general-components/FormHelper";
import {Session} from "../../../general-components/Session/Session";

interface RegisterState {
    isRegistering: boolean
    loaded?: boolean
}

class Register extends Component<any, RegisterState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isRegistering: false
        };
    }

    register = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            isRegistering: true
        });

        let email: string = extractFromForm(e, "email") as string;
        let username: string = extractFromForm(e, "username") as string;
        let password: string = extractFromForm(e, "password") as string;

        await Session.register(email, username, password);
    }

    render() {
        return (
            <Form className={"registerContainer"} onSubmit={(e) => {
                this.register(e)
            }}>
                <h2>Registrieren</h2>

                <hr/>

                {/*E-MAIL*/}
                <Form.Group className={"mb-2 mt-2 form-floating"}>
                    <Form.Control
                        id="email"
                        type="email"
                        name={"email"}
                        size={"sm"}
                        placeholder="name@example.com"
                        required={true}
                    />
                    <Form.Label htmlFor={"email"} className={"email"}>E-Mail</Form.Label>
                </Form.Group>

                {/*USERNAME*/}
                <Form.Group className={"mb-2 mt-2 form-floating"}>
                    <Form.Control
                        id="username"
                        type="text"
                        name={"username"}
                        size={"sm"}
                        placeholder="name@example.com"
                        required={true}
                    />
                    <Form.Label htmlFor={"username"}>Benutzername</Form.Label>
                </Form.Group>

                {/*PASSWORD*/}
                <PasswordField required confirm check={true} eye={true}/>

                <hr/>

                {/*SUBMIT*/}
                <Button disabled={this.state.isRegistering} type={"submit"}
                        variant={"dark"}>
                    {" "}Registrieren
                </Button>

            </Form>
        );
    }

}

export default Register;
