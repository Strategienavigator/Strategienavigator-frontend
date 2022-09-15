import {ModalCloseable} from "../../../general-components/Modal/ModalCloseable";
import {Button, Form, FormGroup, Modal} from "react-bootstrap";
import FAE from "../../../general-components/Icons/FAE";
import {faCheck, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import React, {Component, createRef, FormEvent, RefObject} from "react";
import {Session} from "../../../general-components/Session/Session";
import {checkEmail} from "../../../general-components/API/calls/Email";
import {UniqueCheck} from "../../../general-components/UniqueCheck/UniqueCheck";
import {checkUsername} from "../../../general-components/API/calls/Username";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {extractFromForm} from "../../../general-components/FormHelper";
import {isEmpty} from "../../../general-components/ComponentUtils";
import {LoadingButton} from "../../../general-components/LoadingButton/LoadingButton";
import {portUser} from "../../../general-components/API/calls/User";
import {RouteComponentProps, withRouter} from "react-router";
import {Messages} from "../../../general-components/Messages/Messages";


export interface AnonportModalProps {
    show: boolean
    onClose: () => void
}

interface Errors {
    usernameEmpty?: boolean,
    emailEmpty?: boolean
}

interface AnonportModalState {
    errors: Errors,
    isPorting: boolean,
    success?: boolean
}

class AnonportModal extends Component<AnonportModalProps & RouteComponentProps, AnonportModalState> {
    private passwordField: RefObject<PasswordField<any>> = createRef();
    private uniqueEmail: RefObject<UniqueCheck & HTMLInputElement> = createRef();
    private uniqueUsername: RefObject<UniqueCheck & HTMLInputElement> = createRef();

    constructor(props: any) {
        super(props);

        this.state = {
            errors: {},
            isPorting: false,
            success: undefined
        }
    }

    private onPort = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let user = Session.currentUser;
        let email = extractFromForm(e, "email") as string;
        let username = extractFromForm(e, "username") as string;
        let password = extractFromForm(e, "password") as string;

        this.setState({
            isPorting: true
        });

        if (
            this.passwordField.current &&
            this.uniqueUsername.current &&
            this.uniqueEmail.current &&
            user
        ) {
            let errors: Errors = {
                emailEmpty: isEmpty(email),
                usernameEmpty: isEmpty(username)
            };

            if (
                !errors.emailEmpty &&
                !errors.usernameEmpty &&
                this.uniqueEmail.current.isAvailable() &&
                this.uniqueUsername.current.isAvailable() &&
                this.passwordField.current.isMatching() &&
                this.passwordField.current.isValid()
            ) {
                let call = await portUser({
                    email: email,
                    password: password,
                    username: username
                });

                if (call && call.success) {
                    let logoutCall = await Session.logout();

                    if (logoutCall && logoutCall.success) {
                        Messages.add((
                            <div>
                                Konto erfolgreich portiert.<br />
                                Überprüfen Sie Ihre E-Mails!
                            </div>
                        ), "SUCCESS", 8000);

                        this.props.onClose();
                        this.props.history.push(`/login?email=${email}&bestaetigen`);
                    } else {
                        this.setState({
                            success: false
                        });
                    }
                } else {
                    this.setState({
                       success: false
                    });
                }
            } else {
                this.setState({
                    errors: errors
                });
            }

            this.setState({
                isPorting: false
            });
        }
    }

    resetError = () => {
        this.setState({
            errors: {},
            success: undefined
        });
    }

    render() {
        let required = false;

        return (
            <ModalCloseable
                show={this.props.show}
                centered
                backdrop
                keyboard
                onHide={this.props.onClose}
            >
                <Form onSubmit={this.onPort}>
                    <Modal.Header>
                        <h5>Anonymes Konto portieren</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Hier können Sie sich nun Registrieren und Ihr Anonymes Konto auf ein Richtiges Konto
                            portieren.</p>
                        <p><FAE icon={faInfoCircle}/> Ihre Speicherstände und Einstellungen werden übernommen.</p>

                        <FormGroup className={"mb-2"}>
                            <Form.FloatingLabel label={"E-Mail"}>
                                <UniqueCheck
                                    ref={this.uniqueEmail}
                                    id="email"
                                    type="email"
                                    name={"email"}
                                    size={"sm"}
                                    placeholder="name@example.com"
                                    required={required}
                                    onChangedValue={this.resetError}
                                    callback={checkEmail}
                                    entityName={"E-Mail"}
                                />

                                <div className={"feedbackContainer"}>
                                    {(this.state.errors.emailEmpty) && (
                                        <div className={"feedback DANGER"}>
                                            Bitte geben Sie eine E-Mail-Adresse an!
                                        </div>
                                    )}
                                </div>
                            </Form.FloatingLabel>
                        </FormGroup>

                        <FormGroup className={"mb-2"}>
                            <Form.FloatingLabel label={"Benutzername"}>
                                <UniqueCheck
                                    ref={this.uniqueUsername}
                                    id="username"
                                    type="text"
                                    name={"username"}
                                    size={"sm"}
                                    placeholder=""
                                    required={required}
                                    onChangedValue={this.resetError}
                                    callback={checkUsername}
                                    entityName={"Username"}
                                />

                                <div className={"feedbackContainer"}>
                                    {(this.state.errors.usernameEmpty) && (
                                        <div className={"feedback DANGER"}>
                                            Bitte geben Sie einen Benutzernamen an!
                                        </div>
                                    )}
                                </div>
                            </Form.FloatingLabel>
                        </FormGroup>

                        <PasswordField
                            ref={this.passwordField}
                            required={required}
                            confirm
                            check
                            eye
                            onChange={this.resetError}
                        />

                        <div className={"feedbackContainer"}>
                            {(
                                this.state.success !== undefined &&
                                !this.state.success
                            ) && (
                                <div className={"feedback DANGER"}>
                                    Es ist ein Fehler aufgetreten! Bitte versuchen Sie es später erneut!
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <LoadingButton
                            size={"sm"}
                            type={"submit"}
                            variant={"success"}
                            defaultChild={"Portieren"}
                            savingChild={"Portiert..."}
                            isLoading={this.state.isPorting}
                            defaultIcon={faCheck}
                        />

                        <Button
                            size={"sm"}
                            onClick={this.props.onClose}
                        >
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </Form>
            </ModalCloseable>
        );
    }

}

export default withRouter(AnonportModal);