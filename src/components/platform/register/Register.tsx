import React, {Component, FormEvent} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {checkPassword, PasswordField} from "../../../general-components/PasswordField/PasswordField";

import "./register.scss";
import {extractFromForm} from "../../../general-components/FormHelper";
import {Session} from "../../../general-components/Session/Session";

interface RegisterState {
    passwordNotMatchingConfirmed?: boolean
    isRegistering: boolean
    loaded?: boolean
}

class Register extends Component<any, RegisterState> {

    private password: string | null = null;
    private passwordConfirm: string | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            isRegistering: false
        };
    }

    isSamePassword = () => {
        if (this.password !== null && this.passwordConfirm !== null) {
            if (this.password === this.passwordConfirm) {
                this.setState({
                    passwordNotMatchingConfirmed: false
                });
            } else {
                this.setState({
                    passwordNotMatchingConfirmed: true
                });
            }
        }
    }

    passwordConfirmChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.passwordConfirm = e.currentTarget.value;
        this.isSamePassword();
    }

    passwordChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.password = e.currentTarget.value;
        this.isSamePassword();
    }

    register = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            isRegistering: true
        });

        let email: string = extractFromForm(e, "email") as string;
        let username: string = extractFromForm(e, "username") as string;
        let password: string = extractFromForm(e, "password") as string;

        let call = await Session.register(email, username, password);
        console.log(call);
    }

    render() {
        return (
            <Form className={"registerContainer"} onSubmit={(e) => {
                this.register(e)
            }}>
                <h2>Registrieren</h2>

                <hr />

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
                <PasswordField changeHandler={(e) => {
                    this.passwordChanged(e)
                }} check={true} eye={true}/>

                {/*PASSWORD CONFIRMATION*/}
                <Form.Group className={"mb-2 mt-2 form-floating"}>
                    <Form.Control
                        id="passwordConfirm"
                        type="password"
                        name={"passwordConfirm"}
                        size={"sm"}
                        placeholder=""
                        required={true}
                        onChange={(e) => {
                            this.passwordConfirmChanged(e)
                        }}
                    />
                    <Form.Label htmlFor={"passwordConfirm"}>Passwort wiederholen</Form.Label>
                </Form.Group>

                <div className={"feedback"}>
                    {(this.state.passwordNotMatchingConfirmed) && (
                        <div className="invalid-feedback d-block">
                            Passwörter müssen übereinstimmen!
                        </div>
                    )}
                </div>

                <hr />

                {/*SUBMIT*/}
                <Button disabled={this.state.passwordNotMatchingConfirmed || this.state.isRegistering} type={"submit"} variant={"dark"}>
                    {" "}Registrieren
                </Button>

            </Form>
        );
    }

}

export default Register;
