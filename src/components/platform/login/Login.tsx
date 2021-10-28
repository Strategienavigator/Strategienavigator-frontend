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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt, faUserSecret} from "@fortawesome/free-solid-svg-icons/";
import {AnonymousModal} from "../../../general-components/ProtectedRoute";


export interface LoginState {
    failed: boolean
    isLoggingIn: boolean
    isLoggingInAnonymously: boolean
    showAnonymousModal: boolean
    loaded?: boolean
}

export class LoginComponent extends Component<any, LoginState> {

    constructor(props: any) {
        super(props);

        this.state = {
            isLoggingIn: false,
            isLoggingInAnonymously: false,
            showAnonymousModal: false,
            failed: false
        };
    }

    login = async (e: FormEvent<HTMLFormElement>) => {
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

    loginAnonymously = async () => {
        this.setState({
            isLoggingInAnonymously: true
        });

        let anonUser = await Session.loginAnonymous();
        if (anonUser) {
            let password = anonUser.password
            let username = anonUser.username;

            let user = await Session.login(username, password, true);
            if (user) {
                Messages.add("Sie wurden anonym angemeldet!", "SUCCESS", Messages.TIMER);
                this.props.history.push("/my-profile");
            }
        }

        this.setState({
            isLoggingInAnonymously: false
        });
    }

    render() {
        return (
            <Form className={"loginContainer"} onSubmit={async (e) => {
                e.preventDefault();
                await this.login(e);
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

                <Link to={"/reset-password"} className={"link-primary"}>Passwort vergessen?</Link>

                <hr/>

                <Button disabled={this.state.isLoggingIn} type={"submit"} variant={"dark"}>
                    {(this.state.isLoggingIn) ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faSignInAlt}/>
                    )}
                    {" "}Anmelden
                </Button>

                &nbsp;

                <Button disabled={this.state.isLoggingInAnonymously} onClick={() => {
                    this.setState({
                        showAnonymousModal: true
                    });
                }} type={"button"} variant={"dark"}>
                    {(this.state.isLoggingInAnonymously) ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUserSecret}/>
                    )}
                    {" "}Anonym Anmelden
                </Button>

                {(
                    this.state.showAnonymousModal
                ) && (
                    <AnonymousModal onShowChange={(show: boolean) => {
                        this.setState({
                            showAnonymousModal: show
                        });
                    }} onAgreement={this.loginAnonymously} onDisagreement={async () => {
                    }}/>
                )}
            </Form>
        );
    }

}

export const Login = withRouter(LoginComponent);

