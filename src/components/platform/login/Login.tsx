import {Component, FormEvent} from "react";
import {Form} from "react-bootstrap";
import {Session} from "../../../general-components/Session/Session";
import {extractFromForm} from "../../../general-components/FormHelper";
import {reload_app} from "../../../index";
import {RouteComponentProps, withRouter} from "react-router";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {Messages} from "../../../general-components/Messages/Messages";

import "./login.scss";
import {Link} from "react-router-dom";
import {faSignInAlt, faUserSecret} from "@fortawesome/free-solid-svg-icons/";
import {AnonymousModal} from "../../../general-components/ProtectedRoute";
import {LoadingButton} from "../../../general-components/LoadingButton/LoadingButton";
import {ButtonPanel} from "../../../general-components/ButtonPanel/ButtonPanel";


export interface LoginState {
    failed: boolean
    isLoggingIn: boolean
    isLoggingInAnonymously: boolean
    showAnonymousModal: boolean
    loaded?: boolean
}

export class LoginComponent extends Component<RouteComponentProps<any, any, any>, LoginState> {

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
        let params: URLSearchParams = new URLSearchParams(this.props.location.search);

        let email;
        if (params.has("email")) {
            email = params.get("email") ?? undefined;
        }

        let hasCheckNotice = params.has("bestaetigen");

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
                        defaultValue={email}
                        placeholder="name@example.com"
                    />
                    <Form.Label htmlFor={"email"} className={"email"}>E-Mail</Form.Label>
                </Form.Floating>

                <PasswordField autofocus={email !== undefined} check={false}/>

                <Form.Group className={"mb-2 mt-2"}>
                    <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        label="Angemeldet bleiben"
                    />
                </Form.Group>

                <div className={"feedbackContainer"}>
                    {(this.state.loaded && this.state.failed) && (
                        <div className="feedback DANGER">
                            Anmeldung fehlgeschlagen!
                        </div>
                    )}
                    {(hasCheckNotice) && (
                        <div className={"feedback INFO"}>
                            Eventuell müssen Sie noch Ihre E-Mail-Adresse noch bestätigen!
                        </div>
                    )}
                </div>

                <hr/>

                <p><Link to={"/reset-password"} className={"link-primary"}>
                    Passwort vergessen?
                </Link></p>

                <ButtonPanel>
                    <LoadingButton
                        isLoading={this.state.isLoggingIn}
                        defaultChild={"Anmelden"}
                        defaultIcon={faSignInAlt}
                        savingChild={"Wird angemeldet..."}
                        type={"submit"}
                    />

                    <LoadingButton
                        isLoading={this.state.isLoggingInAnonymously}
                        defaultChild={"Anonym Anmelden"}
                        defaultIcon={faUserSecret}
                        savingChild={"Wird angemeldet..."}
                        onClick={() => {
                            this.setState({
                                showAnonymousModal: true
                            });
                        }}
                    />
                </ButtonPanel>

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

