import React, {Component, FormEvent} from "react";
import {Button, Form} from "react-bootstrap";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";

import "./register.scss";
import {extractFromForm} from "../../../general-components/FormHelper";
import {Session} from "../../../general-components/Session/Session";
import {UniqueCheck} from "../../../general-components/UniqueCheck/UniqueCheck";
import {checkUsername} from "../../../general-components/API/calls/Username";
import {checkEmail} from "../../../general-components/API/calls/Email";

interface RegisterState {
    isRegistering: boolean
    loaded?: boolean
}

export class Register extends Component<any, RegisterState> {

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
            <Form className={"registerContainer"} onSubmit={async (e) => {
                await this.register(e)
            }}>
                <h2>Registrieren</h2>

                <hr/>

                {/*E-MAIL*/}
                <Form.Floating className={"mb-2 mt-2"}>
                    <UniqueCheck
                        id="email"
                        type="email"
                        name={"email"}
                        size={"sm"}
                        placeholder="name@example.com"
                        required={true}
                        callback={checkEmail}
                        failMessage={"E-Mail bereits vorhanden!"}
                        successMessage={"E-Mail verfügbar!"}
                    />
                    <Form.Label htmlFor={"email"} className={"email"}>E-Mail</Form.Label>
                </Form.Floating>

                {/*USERNAME*/}
                <Form.Floating className={"mb-2 mt-2"}>
                    <UniqueCheck
                        id="username"
                        type="text"
                        name={"username"}
                        size={"sm"}
                        placeholder="name@example.com"
                        required={true}
                        callback={checkUsername}
                        failMessage={"Username bereits vorhanden!"}
                        successMessage={"Username verfügbar!"}
                    />
                    <Form.Label htmlFor={"username"}>Benutzername</Form.Label>
                </Form.Floating>

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
