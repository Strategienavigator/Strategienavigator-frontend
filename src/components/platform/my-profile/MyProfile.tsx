import React, {Component, FormEvent} from "react";
import {Session} from "../../../general-components/Session/Session";
import {User} from "../../../general-components/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPencilAlt, faSave, faTrash, faUser} from "@fortawesome/free-solid-svg-icons/";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {extractFromForm} from "../../../general-components/FormHelper";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {deleteUser, UpdateData, updateUser} from "../../../general-components/API/calls/User";
import {reload_app} from "../../../index";
import {withRouter} from "react-router";
import {Messages} from "../../../general-components/Messages/Messages";
import {checkEmail} from "../../../general-components/API/calls/Email";
import {checkUsername} from "../../../general-components/API/calls/Username";
import {UniqueCheck} from "../../../general-components/UniqueCheck/UniqueCheck";
import {Loader} from "../../../general-components/Loader/Loader";

import "./my-profile.scss";
import {LoadingButton} from "../../../general-components/LoadingButton/LoadingButton";


export interface MyProfileState {
    user: User
    edit: boolean
    delete: boolean
    showDeleteModal: boolean
    passwordFieldTouched: boolean
    passwordNotMatching?: boolean
    isSaving: boolean
    isSaved?: boolean
    userLoaded: boolean
}

export class MyProfileComponent extends Component<any, MyProfileState> {

    private password: string | null = null;
    private passwordConfirm: string | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            user: Session.currentUser as User,
            edit: false,
            delete: false,
            showDeleteModal: true,
            passwordFieldTouched: false,
            isSaving: false,
            userLoaded: false
        }
    }

    isSamePassword = () => {
        if (this.password !== null && this.passwordConfirm !== null) {
            if (this.password === this.passwordConfirm) {
                this.setState({
                    passwordNotMatching: false
                });
            } else {
                this.setState({
                    passwordNotMatching: true
                });
            }
        } else {
            this.setState({
                passwordNotMatching: true
            });
        }
    }

    passwordChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.password = e.currentTarget.value;
        if (this.password !== "") {
            this.setState({passwordFieldTouched: true});
        } else {
            this.setState({passwordFieldTouched: false});
        }
        this.isSamePassword();
    }

    passwordConfirmChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.passwordConfirm = e.currentTarget.value;
        this.isSamePassword();
    }

    changeView = () => {
        this.setState({
            edit: !this.state.edit
        });
    }

    saveChanges = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        this.setState({
            isSaving: true
        });

        let email: string = extractFromForm(e, "email") as string;
        let username: string = extractFromForm(e, "username") as string;
        let current_password: string = extractFromForm(e, "current_password") as string;
        let new_password: string = extractFromForm(e, "new_password") as string;

        let new_username = username !== this.state.user.getUsername() ? username : undefined
        let new_email = email !== this.state.user.getEmail() ? email : undefined

        let needs_update = new_email !== undefined || new_username !== undefined || new_password.length > 0;

        if (needs_update) {

            let data: UpdateData = {
                current_password: current_password,
                email: new_email,
                username: new_username
            }

            if (new_password.length > 0) {
                data.password = new_password;
            }

            let call = await updateUser(Session.currentUser?.getID() as number, data, {
                errorCallback: (reason) => {
                    Messages.add("Beim speichern ist ein Fehler aufgetreten", "DANGER", Messages.TIMER);
                    console.error(reason);
                }
            });

            if (call && call.success) {
                Session.currentUser?.update(data);
                reload_app();
                this.setState({
                    isSaved: true
                })
            }
        } else {
            // fake load so the user thinks something is happening
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        this.setState({
            isSaving: false
        });
    }

    showDeleteModal = () => {
        this.setState({
            delete: true,
            showDeleteModal: true
        });
    }

    hideDeleteModal = () => {
        this.setState({
            delete: false,
            showDeleteModal: false
        });
    }

    delete = async () => {
        await deleteUser(Session.currentUser?.getID() as number);

        Session.setCurrent(null);
        Session.removeTokens();

        this.props.history.push("/");
        Messages.add("Ihr Konto wurde gelöscht!", "SUCCESS", 7000);

        reload_app();
    }

    render() {
        if (!this.state.userLoaded) {
            return (
                <Loader payload={[]} loaded={false} transparent fullscreen/>
            );
        }

        return (
            <Form onSubmit={async (e) => {
                await this.saveChanges(e)
            }} className={"profile"}>
                <h4>
                    <FontAwesomeIcon icon={faUser}/> &nbsp;{this.state.user.getUsername()}
                    {(this.state.edit) && (
                        <Button style={{float: "right"}} disabled={this.state.isSaving} size={"sm"} variant={"dark"}
                                className={"editButton"} onClick={this.changeView}>
                            <FontAwesomeIcon icon={faArrowLeft}/> &nbsp;Zurück
                        </Button>
                    )}
                </h4>

                <hr/>

                {/* BENUTZERNAME */}
                <Form.Floating className={"field"}>
                    <UniqueCheck
                        id={"username"}
                        type={"text"}
                        readOnly={!this.state.edit}
                        suppressErrors={!this.state.edit}
                        defaultValue={this.state.user.getUsername()}
                        value={this.state.edit ? undefined : this.state.user.getUsername()}
                        callback={checkUsername}
                        failMessage={"Username bereits vorhanden!"}
                        successMessage={"Username verfügbar!"}
                    />
                    <Form.Label>Benutzername</Form.Label>
                </Form.Floating>

                {/* E-MAIL */}
                <Form.Floating className={"field"}>
                    <UniqueCheck
                        id={"email"}
                        type={"text"}
                        readOnly={!this.state.edit}
                        suppressErrors={!this.state.edit}
                        defaultValue={this.state.user.getEmail()}
                        value={this.state.edit ? undefined : this.state.user.getEmail()}
                        callback={checkEmail}
                        failMessage={"E-Mail bereits vorhanden!"}
                        successMessage={"E-Mail verfügbar!"}
                    />
                    <Form.Label>E-Mail-Adresse</Form.Label>
                </Form.Floating>
                {/* changeHandler={(e) => {
                    this.passwordChanged(e)
                }}*/}

                {/* NEUES PASSWORD */}
                {(this.state.edit) && (
                    <PasswordField id={"new_password"} text={"Neues Passwort"} required={false} className={"field"}
                                   check={true}
                                   value={this.state.edit ? undefined : ""}
                                   eye/>
                )}

                {/* NEUES PASSWORD WIEDERHOLEN */}
                {(this.state.edit) && (
                    <>
                        <PasswordField id={"new_password_confirm"} text={"Neues Passwort wiederholen"}
                                       required={this.state.passwordFieldTouched}
                                       className={"field"} check={false}
                                       value={this.state.edit ? undefined : ""}
                                       eye/>
                        <div className={"feedback"}>
                            {(this.state.passwordNotMatching) && (
                                <div className="invalid-feedback d-block">
                                    Passwörter müssen übereinstimmen!
                                </div>
                            )}
                        </div>
                    </>
                )}


                {/* AKTUELLES PASSWORD */}
                {(this.state.edit) && (
                    <>
                        <hr/>
                        <PasswordField id={"current_password"} text={"Aktuelles Passwort"} required={true}
                                       className={"field"} check={false}
                                       value={this.state.edit ? undefined : ""} eye/>
                    </>
                )}

                <hr/>

                {(!this.state.edit) && (
                    <div>
                        <h5>Überblick Analysen</h5>
                        <Row>
                            <Col>
                                Eigene Analysen <br/>
                                {this.state.user.getOwnedSavesAmount()}
                            </Col>
                            <Col>
                                Geteilte Analysen <br/>
                                {this.state.user.getSharedSavesAmount()}
                            </Col>
                        </Row>
                        <hr/>
                    </div>

                )}

                {(this.state.isSaved !== undefined && this.state.isSaved) && (
                    <div className={"feedback text-success"}>
                        Ihre Benutzerdaten wurden abgespeichert!
                    </div>
                )}

                {(!this.state.edit) && (
                    <Button size={"sm"} variant={"dark"} className={"editButton"} onClick={this.changeView}>
                        <FontAwesomeIcon icon={faPencilAlt}/> &nbsp; Bearbeiten
                    </Button>
                )}
                {(this.state.edit) && (
                    <>
                        <div className={"buttonGroup"}>
                            <LoadingButton
                                disabled={(this.state.isSaving) || (this.state.passwordFieldTouched && this.state.passwordNotMatching)}
                                size={"sm"} type={"submit"} variant={"dark"} className={"editButton"}
                                isSaving={this.state.isSaving} savingChild={"Speichert"} defaultChild={"Änderungen speichern"}/>
                        </div>
                        <div className={"buttonGroup"}>
                            <Button disabled={this.state.isSaving} size={"sm"} variant={"danger"}
                                    className={"deleteButton"}
                                    onClick={this.showDeleteModal}>
                                <FontAwesomeIcon icon={faTrash}/> &nbsp; Benutzer löschen
                            </Button>
                        </div>
                    </>
                )}

                {(this.state.delete) && (
                    <Modal
                        show={this.state.showDeleteModal}
                        backdrop="static"
                        keyboard={true}
                    >
                        <Modal.Header>
                            <Modal.Title>Wollen Sie Ihr Profil wirklich löschen?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Sie sind bis zu <b>30 Tagen</b> nach dem Löschen Ihres Accounts dazu in der
                            Lage das Löschen rückgängig zu machen, indem Sie sich anmelden. Nach Ablauf dieses
                            Zeitraumes wird
                            Ihr Account unwiderruflich gelöscht!
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant={"light"} onClick={this.hideDeleteModal}>
                                Abbrechen
                            </Button>
                            <Button variant="dark" onClick={this.delete}>
                                Ja, Account löschen!
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

            </Form>
        );
    }

    componentDidMount = async () => {
        let user = await Session.checkLogin();
        if (user) {
            this.setState({
                userLoaded: true,
                user: user
            });
        }
    }

}

export const MyProfile = withRouter(MyProfileComponent);
