import {Component, FormEvent} from "react";
import {Button, Form, Spinner} from "react-bootstrap";
import {Session} from "../../../general-components/Session/Session";
import {extractFromForm} from "../../../general-components/FormHelper";
import {reload_app} from "../../../index";
import {withRouter} from "react-router";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {Messages} from "../../../general-components/Messages/Messages";

import "./login.scss";
import {Link} from "react-router-dom";


export interface LoginState {
    failed: boolean
    isLoggingIn: boolean
    loaded?: boolean
}

export class LoginComponent extends Component<any, LoginState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isLoggingIn: false,
            failed: false
        };
    }

    login = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            isLoggingIn: true
        });

        let email: string = extractFromForm(e, "email") as string;
        let password: string = extractFromForm(e, "password") as string;
        let rememberMe: boolean = extractFromForm(e, "rememberMe") as boolean;

        let user = await Session.login(email, password, rememberMe);

        if (user !== null) {
            reload_app();

            Messages.add("Willkommen zurück!", "SUCCESS", Messages.TIMER);

            this.props.history.push("/my-profile");
        } else {
            this.setState({
                loaded: true,
                failed: true
            });

            this.setState({
                isLoggingIn: false
            });
        }
    }

    render() {
        return (
            <Form className={"loginContainer"} onSubmit={(e) => {
                this.login(e)
            }}>
                <h2>Anmelden</h2>

                <hr/>

                <Form.Floating className={"mb-2 mt-2"}>
                    <Form.Control
                        id="email"
                        type="email"
                        name={"email"}
                        size={"sm"}
                        placeholder="name@example.com"
                    />
                    <Form.Label htmlFor={"email"} className={"email"}>E-Mail</Form.Label>
                </Form.Floating>

                <PasswordField check={false}/>

                <Form.Group className={"mb-2 mt-2"}>
                    <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        label="Angemeldet bleiben"
                    />
                </Form.Group>

                <div className={"feedback"}>
                    {(this.state.loaded && this.state.failed) && (
                        <div className="invalid-feedback d-block">
                            Anmeldung fehlgeschlagen!
                        </div>
                    )}
                </div>

                <Link to={"/reset-password"}>Passwort vergessen?</Link>

                <hr/>

                <Button disabled={this.state.isLoggingIn} type={"submit"} variant={"dark"}>
                    {(this.state.isLoggingIn) && (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    )}
                    {" "}Anmelden
                </Button>
            </Form>
        );
    }

}

export const Login = withRouter(LoginComponent);

