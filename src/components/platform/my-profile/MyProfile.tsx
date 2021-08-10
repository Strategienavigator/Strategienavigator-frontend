import React, {Component, FormEvent} from "react";
import {Session} from "../../../general-components/Session/Session";
import {User} from "../../../general-components/User";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faSave, faTimes, faUser} from "@fortawesome/free-solid-svg-icons/";
import {Button, Form, FormControl, Modal} from "react-bootstrap";

import "./my-profile.scss";
import {extractFromForm} from "../../../general-components/FormHelper";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {deleteUser, updateData, updateUser} from "../../../general-components/API/calls/User";
import {reload_app} from "../../../index";
import {withRouter} from "react-router";
import {Messages} from "../../../general-components/Messages/Messages";

interface MyProfileState {
    user: User
    edit: boolean
    delete: boolean
    showDeleteModal: boolean
    passwordFieldTouched: boolean
    passwordNotMatching?: boolean
    isSaving: boolean
    isSaved?: boolean
}

class MyProfile extends Component<any, MyProfileState> {

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

        let data: updateData = {
            current_password: current_password,
            email: email,
            username: username
        }

        if (new_password.length > 0) {
            data.password = new_password;
        }

        let call = await updateUser(Session.currentUser?.getID() as number, data, Session.getToken());

        if (call.success) {
            Session.currentUser?.update(data);
            reload_app();

            this.setState({
                isSaved: true
            });
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
        await deleteUser(Session.currentUser?.getID() as number, Session.getToken());

        Session.setCurrent(null);
        Session.removeTokens();

        this.props.history.push("/");
        Messages.add("Ihr Konto wurde gelöscht!", "SUCCESS", 7000);

        reload_app();
    }

    render() {
        return (
            <Form onSubmit={(e) => {
                this.saveChanges(e)
            }} className={"profile"}>
                <h4>
                    <FontAwesomeIcon icon={faUser}/> &nbsp;{this.state.user.getUsername()}
                </h4>

                <hr/>

                {/* BENUTZERNAME */}
                <Form.Group className={"form-floating field"}>
                    <FormControl id={"username"} type={"text"} readOnly={!this.state.edit}
                                 defaultValue={this.state.user.getUsername()}/>
                    <Form.Label>Benutzername</Form.Label>
                </Form.Group>

                {/* E-MAIL */}
                <Form.Group className={"form-floating field"}>
                    <FormControl id={"email"} type={"text"} readOnly={!this.state.edit}
                                 defaultValue={this.state.user.getEmail()}/>
                    <Form.Label>E-Mail-Adresse</Form.Label>
                </Form.Group>

                {/* NEUES PASSWORD */}
                {(this.state.edit) && (
                    <PasswordField changeHandler={(e) => {
                        this.passwordChanged(e)
                    }} id={"new_password"} text={"Neues Passwort"} required={false} className={"field"} check={true}
                                   eye/>
                )}

                {/* NEUES PASSWORD WIEDERHOLEN */}
                {(this.state.edit) && (
                    <>
                        <PasswordField changeHandler={(e) => {
                            this.passwordConfirmChanged(e)
                        }} id={"new_password_confirm"} text={"Neues Passwort wiederholen"}
                                       required={this.state.passwordFieldTouched}
                                       className={"field"} check={false} eye/>
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
                                       className={"field"} check={false} eye/>
                    </>
                )}

                <hr/>

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
                            <Button
                                disabled={(this.state.isSaving) || (this.state.passwordFieldTouched && this.state.passwordNotMatching)}
                                size={"sm"} type={"submit"} variant={"dark"} className={"editButton"}>
                                <FontAwesomeIcon icon={faSave}/> &nbsp; Änderungen speichern
                            </Button>

                            <Button disabled={this.state.isSaving} size={"sm"} variant={"dark"}
                                    className={"editButton"} onClick={this.changeView}>
                                <FontAwesomeIcon icon={faTimes}/> &nbsp; Bearbeiten abbrechen
                            </Button>
                        </div>
                        <div className={"buttonGroup"}>
                            <Button disabled={this.state.isSaving} size={"sm"} variant={"dark"}
                                    className={"deleteButton"}
                                    onClick={this.showDeleteModal}>
                                <FontAwesomeIcon icon={faTimes}/> &nbsp; Benutzer löschen
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
                            Sie sind bis zu eine Woche nach dem Löschen Ihres Accounts dazu in der
                            Lage das Löschen rückgängig zu machen. Nach Ablauf dieses Zeitraumes wird
                            Ihr Account unwideruflich gelöscht!
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

}

export default withRouter(MyProfile);