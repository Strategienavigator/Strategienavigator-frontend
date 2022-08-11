import {Badge, Button, FormControl, InputGroup, Modal, Table} from "react-bootstrap";

import "./save-invitation-modal.scss";
import {faCopy, faSearch, faUsers} from "@fortawesome/free-solid-svg-icons";
import FAE from "../Icons/FAE";
import {Component} from "react";
import {InvitationLinkModal} from "./InvitationLinkModal/InvitationLinkModal";
import {ModalCloseable} from "../Modal/ModalCloseable";
import {
    InvitationLinkResource, SharedSaveResource,
    SimpleSaveResource,
    SimplestUserResource,
    UserSearchResultResource
} from "../Datastructures";
import {Loader} from "../Loader/Loader";
import {createInvitationLink, deleteInvitationLink, showInvitationLinks} from "../API/calls/Invitations";
import {faTrash} from "@fortawesome/free-solid-svg-icons/";
import {Messages} from "../Messages/Messages";
import {SingleInviteModal} from "./SingleInviteModal/SingleInviteModal";
import { searchUser } from "../API/calls/User";
import {createContribution, getContributors} from "../API/calls/Contribution";
import {CreateContextOptions} from "vm";
import {CollaboratorsModal} from "./CollaboratorsModal/CollaboratorsModal";
import {LoadingButton} from "../LoadingButton/LoadingButton";


export interface SaveInvitationProps {
    show: boolean
    onClose: () => void
    save: SimpleSaveResource | null
}

export interface SaveInvitationState {
    searchItems: UserSearchResultResource[],
    isSearching: boolean,
    searchText: string | null,
    showSingleInviteModal: UserSearchResultResource | null,
    showInvitationLinkModal: boolean,
    links: InvitationLinkResource[],
    deleteInvitationLink: string | null,
    inviteSuccess?: boolean,
    showCollaboratorsModal: boolean,
    contributorsLoading: boolean,
    contributors: SharedSaveResource[]
}

class SaveInvitation extends Component<SaveInvitationProps, SaveInvitationState> {
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: SaveInvitationProps | Readonly<SaveInvitationProps>) {
        super(props);

        this.state = {
            searchItems: [],
            isSearching: false,
            showSingleInviteModal: null,
            searchText: null,
            showInvitationLinkModal: false,
            links: [],
            deleteInvitationLink: null,
            inviteSuccess: undefined,
            showCollaboratorsModal: false,
            contributors: [],
            contributorsLoading: false
        }
    }

    render() {
        const getLinks = async () => {
            if (this.props.save !== null) {
                await this.loadInviteLinks(this.props.save);
            }
        }

        return (
            <>
                <ModalCloseable
                    className={"save-invitation-modal"}
                    size={"lg"}
                    show={this.props.show}
                    centered
                    onHide={this.props.onClose}
                    keyboard={true}
                >
                    <Modal.Header>
                        <h4>Einladung erstellen</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={"link"}>
                            <Loader
                                payload={[getLinks]}
                                transparent={true}
                                size={50}
                            >
                                <h5>
                                    Alle Einladungslinks&nbsp;
                                    <Badge
                                        bg={"dark"}
                                        pill={true}
                                    >
                                        {this.state.links.length}
                                    </Badge>
                                </h5>

                                <Table
                                    hover={true}
                                    size={"sm"}
                                >
                                    <tbody>
                                    {this.state.links.map((link, index) => {
                                        return (
                                            <tr key={link.token + "-" + index}>
                                                <td>/invitation/{link.token}</td>
                                                <td
                                                    onClick={async () => {
                                                        let location = window.location.origin;
                                                        await navigator.clipboard.writeText(location + "/invitation/" + link.token);
                                                        Messages.add("Link kopiert!", "SUCCESS", Messages.TIMER);
                                                    }}
                                                >
                                                    <FAE
                                                        style={{cursor: "pointer"}}
                                                        icon={faCopy}
                                                    />
                                                </td>
                                                <td
                                                    onClick={() => {
                                                        this.setState({
                                                            deleteInvitationLink: link.token
                                                        });
                                                    }}
                                                >
                                                    <FAE
                                                        style={{cursor: "pointer"}}
                                                        className={"text-danger"}
                                                        icon={faTrash}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </Loader>

                            <Button
                                size={"sm"}
                                onClick={this.openInvitationLinkModal}
                            >
                                Link erstellen
                            </Button>
                        </div>

                        <hr/>

                        <div className={"direct"}>
                            <h5>Benutzer direkt einladen</h5>

                            <InputGroup className={"mb-2"}>
                                <FormControl
                                    size={"sm"}
                                    name={"username-search"}
                                    placeholder={"Benutzername/E-Mail..."}
                                    onChange={async (e) => {
                                        let value = e.target.value;

                                        if (value === "") {
                                            this.setState({
                                                searchItems: [],
                                                isSearching: false
                                            });
                                        } else {
                                            if (this.timeout) {
                                                clearTimeout(this.timeout);
                                            }

                                            this.timeout = setTimeout(async () => {
                                                this.setState({
                                                    searchText: value,
                                                    isSearching: true
                                                }, () => {
                                                    this.searchForUser();
                                                });
                                            }, 400);
                                        }
                                    }}
                                />
                                <Button
                                    onClick={this.searchForUser}
                                >
                                    <FAE icon={faSearch}/>
                                </Button>
                            </InputGroup>

                            <Loader payload={[]} loaded={!this.state.isSearching} transparent size={50}>
                                <Table size={"sm"} hover={true}>
                                    <tbody>
                                    {(this.state.searchItems?.map((user, index) => {
                                        return (
                                            <tr
                                                key={user + "-" + index}
                                                onClick={() => {
                                                    this.setState({
                                                        showSingleInviteModal: user
                                                    });
                                                }}
                                                style={{cursor: "pointer"}}
                                            >
                                                <td>{user.username}</td>
                                            </tr>
                                        );
                                    }))}
                                    </tbody>
                                </Table>
                            </Loader>

                            <div className={"feedbackContainer"}>
                                {(this.state.inviteSuccess !== undefined) && (
                                    this.state.inviteSuccess ? (
                                        <div className={"feedback SUCCESS"}>
                                            Einladung verschickt!
                                        </div>
                                    ) : (
                                        <div className={"feedback DANGER"}>
                                            Einladung fehlgeschlagen!
                                        </div>
                                    ))
                                }
                            </div>

                            <LoadingButton
                                size={"sm"}
                                onClick={async () => {
                                    if (this.props.save) {
                                        this.setState({contributorsLoading: true});

                                        let call = await getContributors(this.props.save.id);

                                        if (call && call?.success) {
                                            this.setState({
                                                showCollaboratorsModal: true,
                                                contributorsLoading: false,
                                                contributors: call.callData.data
                                            });
                                        }
                                    }

                                }}
                                defaultChild={"Kollaborateure anzeigen"}
                                isSaving={this.state.contributorsLoading}
                                savingChild={"Kollaborateure anzeigen"}
                                defaultIcon={faUsers}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={this.props.onClose}
                        >
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </ModalCloseable>

                <CollaboratorsModal
                    show={this.state.showCollaboratorsModal}
                    contributors={this.state.contributors}
                    onClose={() => {
                        this.setState({
                            showCollaboratorsModal: false,
                            contributors: []
                        });
                    }}
                />

                <SingleInviteModal
                    show={this.state.showSingleInviteModal !== null}
                    onClose={() => {
                        this.setState({
                            showSingleInviteModal: null
                        });
                    }}
                    user={this.state.showSingleInviteModal}
                    onInvite={(async (user, permission) => {
                        if (user && this.props.save) {
                            this.setState({
                                isSearching: true,
                                inviteSuccess: undefined
                            });

                            let data = {
                              permission: parseInt(permission)
                            };
                            let call = await createContribution(this.props.save.id, user.id, data);

                            this.setState({
                                isSearching: false,
                                searchItems: [],
                                inviteSuccess: call?.success
                            });
                        }
                    })}
                />

                <InvitationLinkModal
                    show={this.state.showInvitationLinkModal}
                    onClose={this.closeInvitationLinkModal}
                    onCreation={async (permission, expiry_date) => {
                        if (this.props.save !== null) {
                            let link = await createInvitationLink({
                                save_id: this.props.save.id,
                                permission: parseInt(permission),
                                expiry_date: expiry_date
                            });

                            if (link?.success) {
                                await this.loadInviteLinks(this.props.save);
                            }
                        }
                    }}
                />

                <ModalCloseable
                    backdrop={true}
                    centered={true}
                    className={"second-modal"}
                    backdropClassName={"second-modal-backdrop"}
                    show={this.state.deleteInvitationLink !== null}
                    onHide={() => {
                        this.setState({
                            deleteInvitationLink: null
                        });
                    }}
                >
                    <Modal.Header>
                        <h5>Sind Sie Sicher?</h5>
                    </Modal.Header>
                    <Modal.Body>
                        Der Einladungslink wird endgültig gelöscht.<br/>
                        Dieser Vorgang kann <b>NICHT</b> rückgängig gemacht werden!
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant={"danger"}
                            onClick={async () => {
                                if (this.state.deleteInvitationLink !== null && this.props.save !== null) {
                                    await deleteInvitationLink(this.state.deleteInvitationLink);
                                    await this.loadInviteLinks(this.props.save);

                                    this.setState({
                                        deleteInvitationLink: null
                                    });
                                }
                            }}
                        >
                            Löschen
                        </Button>

                        <Button
                            variant={"primary"}
                            onClick={() => {
                                this.setState({
                                    deleteInvitationLink: null
                                });
                            }}
                        >
                            Abbrechen
                        </Button>
                    </Modal.Footer>
                </ModalCloseable>
            </>
        );
    }

    searchForUser = async () => {
        let searchText = this.state.searchText;
        if (searchText) {
            this.setState({
                isSearching: true
            });

            let call = await searchUser(searchText);
            let data = call?.callData.data ?? [];

            this.setState({
                searchItems: data,
                isSearching: false
            });
        }
    }

    private loadInviteLinks = async (save: SimpleSaveResource) => {
        let links = await showInvitationLinks(save.id);
        if (links?.success) {
            let data = links.callData;

            this.setState({
                links: data.data
            });
        }
    }

    private openInvitationLinkModal = () => {
        this.setState({
            showInvitationLinkModal: true
        });
    }

    private closeInvitationLinkModal = () => {
        this.setState({
            showInvitationLinkModal: false
        });
    }

}


export {
    SaveInvitation
}
