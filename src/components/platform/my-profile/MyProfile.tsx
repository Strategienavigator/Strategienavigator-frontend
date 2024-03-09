import React, {Component, FormEvent} from "react";
import {Session} from "../../../general-components/Session/Session";
import {User} from "../../../general-components/User";
import {faArrowLeft, faPencilAlt, faTrash, faUser} from "@fortawesome/free-solid-svg-icons/";
import {Badge, Button, Card, Col, Form, Modal, Row} from "react-bootstrap";
import {extractFromForm} from "../../../general-components/FormHelper";
import {PasswordField} from "../../../general-components/PasswordField/PasswordField";
import {deleteUser, UpdateData, updateUser} from "../../../general-components/API/calls/User";
import {RouteComponentProps, withRouter} from "react-router";
import {Messages, withMessagesContext, WithMessagesContextProps} from "../../../general-components/Messages/Messages";
import {checkEmail} from "../../../general-components/API/calls/Email";
import {checkUsername} from "../../../general-components/API/calls/Username";
import {UniqueCheck} from "../../../general-components/UniqueCheck/UniqueCheck";
import {Loader} from "../../../general-components/Loader/Loader";

import "./my-profile.scss";
import {LoadingButton} from "../../../general-components/LoadingButton/LoadingButton";
import FAE from "../../../general-components/Icons/FAE";
import {ModalCloseable} from "../../../general-components/Modal/ModalCloseable";
import {UserContext} from "../../../general-components/Contexts/UserContextComponent";
import {ButtonPanel} from "../../../general-components/ButtonPanel/ButtonPanel";
import {getLastOpenedSaves} from "../../../general-components/API/calls/Saves";
import {SimpleSaveResource} from "../../../general-components/Datastructures";
import {Tools} from "../home/Home";
import {getSaveURL} from "../../../general-components/Save";
import {Link} from "react-router-dom";


export interface MyProfileState {
    edit: boolean
    delete: boolean
    showDeleteModal: boolean
    passwordFieldTouched: boolean
    passwordNotMatching?: boolean
    isSaving: boolean
    isSaved?: boolean
    lastOpenedSaves?: SimpleSaveResource[]
}

export class MyProfileComponent extends Component<RouteComponentProps & WithMessagesContextProps, MyProfileState> {

    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>
    private password: string | null = null;
    private passwordConfirm: string | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            edit: false,
            delete: false,
            showDeleteModal: false,
            passwordFieldTouched: false,
            isSaving: false,
            lastOpenedSaves: undefined
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

        let new_username = username !== this.context.user?.getUsername() ? username : undefined
        let new_email = email !== this.context.user?.getEmail() ? email : undefined

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
                    this.props.messageContext.add("Beim speichern ist ein Fehler aufgetreten", "DANGER", Messages.TIMER);
                }
            });

            if (call && call.success) {
                let currentUser = Session.currentUser;

                let newUser = User.from(currentUser);

                newUser.update(data);
                Session.setCurrent(newUser);
                this.setState({
                    isSaved: true
                });
            } else {
                this.props.messageContext.add("Beim Speichern ist ein Fehler aufgetreten", "DANGER", Messages.TIMER);
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
        this.props.messageContext.add("Ihr Konto wurde gelöscht!", "SUCCESS", 7000);
    }

    getLastOpenedSaves = async () => {
        let call = await getLastOpenedSaves();

        this.setState({
            lastOpenedSaves: call?.callData.data
        });
    }

    render() {
        if (!this.context.isLoggedIn) {
            return (
                <Loader payload={[]} loaded={false} transparent fullscreen/>
            );
        }

        return (
            <Form onSubmit={async (e) => {
                await this.saveChanges(e)
            }} className={"profile"}>
                <h4>
                    <FAE icon={faUser}/> &nbsp;{this.context.user?.getUsername()}
                    {(this.state.edit) && (
                        <Button style={{float: "right"}} disabled={this.state.isSaving} variant={"dark"}
                                className={"editButton"} onClick={this.changeView}>
                            <FAE icon={faArrowLeft}/> &nbsp;Zurück
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
                        defaultValue={this.context.user?.getUsername()}
                        value={this.state.edit ? undefined : this.context.user?.getUsername()}
                        callback={checkUsername}
                        entityName={"Username"}
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
                        defaultValue={this.context.user?.getEmail()}
                        value={this.state.edit ? undefined : this.context.user?.getEmail()}
                        callback={checkEmail}
                        entityName={"Email"}
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

                {(!this.state.edit) && (
                    <div>
                        <hr/>

                        <Card>
                            <Card.Header>
                                <h5 className={"mt-2 mb-2"}>Überblick Analysen</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col lg={8}>
                                        <div>
                                            <h5>Zuletzt geöffnet</h5>

                                            <hr/>

                                            <Loader size={70} payload={[this.getLastOpenedSaves]} variant={"auto"}
                                                    alignment={"center"} transparent>
                                                <Row>
                                                    {(this.state.lastOpenedSaves !== undefined && this.state.lastOpenedSaves?.map((save, index) => {
                                                        let tool = Tools.find((v) => v.id === save.tool_id);
                                                        let lastOpened = new Date(save.last_opened);
                                                        let timeString = `${lastOpened.toLocaleDateString()}, ${lastOpened.toLocaleTimeString().split(":").slice(0, 2).join(":")} Uhr`;

                                                        if (tool === undefined)
                                                            return null;

                                                        return (
                                                            <Col key={"lo-save-" + save.id + "-" + index} lg={6}>
                                                                <Card as={Link} to={getSaveURL(save.id, tool.id)} body
                                                                      className={"last-opened-save mb-1"}>
                                                                    <Row>
                                                                        <Col xs={"auto"} title={tool.name}>
                                                                            <FAE icon={tool.icon}/>
                                                                        </Col>
                                                                        <Col>
                                                                            {save.name}
                                                                        </Col>
                                                                    </Row>
                                                                    <Row>
                                                                        <Col>
                                                                            <small className={"text-muted"}>
                                                                                {timeString}
                                                                            </small>
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                            </Col>
                                                        );
                                                    }))}
                                                </Row>
                                            </Loader>
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div>
                                            <h5>Statistiken</h5>

                                            <hr/>

                                            <Row>
                                                <Col xs={"auto"}>
                                                    <Badge bg={"dark"} pill>
                                                        {this.context.user?.getOwnedSavesAmount()}
                                                    </Badge>
                                                </Col>
                                                <Col>
                                                    Anzahl eigener Analysen
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={"auto"}>
                                                    <Badge bg={"dark"} pill>
                                                        {this.context.user?.getSharedSavesAmount()}
                                                    </Badge>
                                                </Col>
                                                <Col>
                                                    Anzahl geteilter Analysen
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <hr/>
                    </div>
                )}

                {(this.state.isSaved !== undefined && this.state.isSaved) && (
                    <div className={"feedback text-success"}>
                        Ihre Benutzerdaten wurden abgespeichert!
                    </div>
                )}

                {(!this.state.edit) && (
                    <Button variant={"dark"} className={"editButton"} onClick={this.changeView}>
                        <FAE icon={faPencilAlt}/> &nbsp; Bearbeiten
                    </Button>
                )}
                {(this.state.edit) && (
                    <ButtonPanel buttonPerCol={2}>
                        <LoadingButton
                            disabled={(this.state.isSaving) || (this.state.passwordFieldTouched && this.state.passwordNotMatching)}
                            type={"submit"} variant={"dark"} className={"editButton"}
                            isLoading={this.state.isSaving} savingChild={"Speichert"}
                            defaultChild={"Änderungen speichern"}
                        />

                        <Button disabled={this.state.isSaving} variant={"danger"}
                                className={"deleteButton"}
                                onClick={this.showDeleteModal}>
                            <FAE icon={faTrash}/> &nbsp; Benutzer löschen
                        </Button>
                    </ButtonPanel>
                )}

                <ModalCloseable
                    show={this.state.showDeleteModal}
                    backdrop="static"
                    onHide={this.hideDeleteModal}
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
                </ModalCloseable>
            </Form>
        );
    }
}

export const MyProfile = withRouter(withMessagesContext(MyProfileComponent));
