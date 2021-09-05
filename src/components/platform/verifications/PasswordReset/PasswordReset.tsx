import React, {Component} from "react";
import {RouteComponentProps} from "react-router";
import {PasswordField} from "../../../../general-components/PasswordField/PasswordField";
import {Button, Form, Spinner} from "react-bootstrap";
import {extractFromForm} from "../../../../general-components/FormHelper";
import {forgotPassword, updatePassword} from "../../../../general-components/API/calls/Password";
import {Link} from "react-router-dom";

import "./password-reset.scss";

export interface RouteMatches {
    token?: string
}

export interface PasswordResetState {
    isRequesting: boolean
    requestSuccess?: boolean

    isChangingPassword: boolean
    changingSuccess?: boolean
}

export class PasswordReset extends Component<RouteComponentProps<RouteMatches>, PasswordResetState> {
    private readonly token: string | undefined;
    private readonly hasToken: boolean;
    private readonly passwordField;

    constructor(props: Readonly<RouteComponentProps<RouteMatches>> | RouteComponentProps<RouteMatches>) {
        super(props);

        this.state = {
            isRequesting: false,
            isChangingPassword: false
        }

        this.token = this.props.match.params.token;
        this.hasToken = this.token !== undefined;
        this.passwordField = React.createRef<PasswordField<any>>();
    }

    requestPasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        this.setState({
            isRequesting: true
        });

        e.preventDefault();

        let email: string = extractFromForm(e, "email") as string;
        let call = await forgotPassword({email: email});

        this.setState({
            requestSuccess: call.success,
            isRequesting: false
        });
    }

    renderPasswordReset = () => {
        return (
            <Form onSubmit={async (e) => await this.requestPasswordReset(e)} className={"passwordReset"}>
                <h4>Passwort zurücksetzen</h4>

                <hr/>

                <p>Geben Sie bitte die E-Mail Adresse an, an die Ihr neues Password versendet werden soll:</p>

                <Form.Floating>
                    <Form.Control placeholder={"Email-Adressse"} name={"email"} id={"email"} type={"email"}/>
                    <label htmlFor={"email"}>E-Mail Adresse</label>
                </Form.Floating>

                <div className={"feedbackContainer"}>
                    {(this.state.requestSuccess) && (
                        <div className={"feedback SUCCESS"}>
                            Bitte öffnen Sie die versendete E-Mail und folgen Sie den dortigen Anweisungen.
                        </div>
                    )}
                    {(this.state.requestSuccess !== undefined && !this.state.requestSuccess) && (
                        <div className={"feedback DANGER"}>
                            Die E-Mail konnte nicht gefunden werden!
                        </div>
                    )}
                </div>

                <Button disabled={this.state.isRequesting} type={"submit"} variant={"dark"}>
                    {(this.state.isRequesting) && (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {" "}
                        </>
                    )}
                    Passwort zurücksetzen!
                </Button>
            </Form>
        );
    }

    changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            isChangingPassword: true
        });

        let password: string = extractFromForm(e, "password") as string;

        if (this.passwordField.current?.isValid() && this.passwordField.current?.isMatching()) {
            await updatePassword(this.token as string, {password: password});

            this.setState({
                changingSuccess: true
            });
        }

        this.setState({
            isChangingPassword: false
        });
    }

    render = () => {
        if (!this.hasToken) {
            return this.renderPasswordReset();
        }

        return (
            <Form onSubmit={async (e) => await this.changePassword(e)}>
                <h4>Passwort zurücksetzen</h4>

                <hr/>

                <PasswordField required confirm ref={this.passwordField} check eye/>

                <div className={"feedbackContainer"}>
                    {(this.state.changingSuccess) && (
                        <div className={"feedback SUCCESS"}>
                            Ihr Passwort wurde aktualisiert. <Link to={"/login"}><Button variant={"dark"}>Jetzt
                            anmelden!</Button></Link>
                        </div>
                    )}
                    {(this.state.changingSuccess !== undefined && !this.state.changingSuccess) && (
                        <div className={"feedback DANGER"}>
                            Es ist ein Fehler aufgetreten!
                        </div>
                    )}
                </div>

                {(this.state.changingSuccess === undefined) && (
                    <Button disabled={this.state.isChangingPassword} type={"submit"} variant={"dark"}>
                        {(this.state.isChangingPassword) && (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                {" "}
                            </>
                        )}
                        Passwort ändern!
                    </Button>
                )}
            </Form>
        );
    }
}
