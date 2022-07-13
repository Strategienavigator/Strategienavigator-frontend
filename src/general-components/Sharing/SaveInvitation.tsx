import {Badge, Button, FormControl, InputGroup, Modal, Table} from "react-bootstrap";

import "./save-invitation-modal.scss";
import {faCopy, faSearch} from "@fortawesome/free-solid-svg-icons";
import FAE from "../Icons/FAE";
import {Component} from "react";
import {
    InvitationLinkModal
} from "./InvitationLinkModal/InvitationLinkModal";
import {ModalCloseable} from "../Modal/ModalCloseable";
import {InvitationLinkResource, SimpleSaveResource} from "../Datastructures";
import { Loader } from "../Loader/Loader";
import {createInvitationLink, deleteInvitationLink, showInvitationLinks} from "../API/calls/Invitations";
import {faTrash} from "@fortawesome/free-solid-svg-icons/";
import {Messages} from "../Messages/Messages";

export interface SaveInvitationProps {
    show: boolean
    onClose: () => void
    save: SimpleSaveResource | null
}

export interface SaveInvitationState {
    searchText: string | null,
    showInvitationLinkModal: boolean
    links: InvitationLinkResource[]
    deleteInvitationLink: string | null
}

class SaveInvitation extends Component<SaveInvitationProps, SaveInvitationState> {

    constructor(props: SaveInvitationProps | Readonly<SaveInvitationProps>) {
        super(props);

        this.state = {
            searchText: null,
            showInvitationLinkModal: false,
            links: [],
            deleteInvitationLink: null
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

                            <InputGroup>
                                <FormControl
                                    size={"sm"}
                                    name={"username-search"}
                                    placeholder={"Benutzername/E-Mail..."}
                                    onChange={(e) => {
                                        this.setState({
                                            searchText: e.target.value
                                        });
                                    }}
                                />
                                <Button
                                    onClick={this.addUser}
                                >
                                    <FAE icon={faSearch}/>
                                </Button>
                            </InputGroup>
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
                        Der Einladungslink wird endgültig gelöscht.<br />
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

    addUser = async() => {
        let searchText = this.state.searchText;
        console.log(searchText);
    }

}


export {
    SaveInvitation
}
