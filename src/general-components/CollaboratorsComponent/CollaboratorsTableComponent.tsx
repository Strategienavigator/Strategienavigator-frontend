import {Component} from "react";
import {Button, FormSelect, Modal, Table} from "react-bootstrap";
import {SharedSavePermission, SharedSaveResource} from "../Datastructures";
import FAE from "../Icons/FAE";
import {getSharedSavePermissionOptions, getSharedSavePermissionText} from "../Save";

import "./collabortors-table-component.scss"
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import {LoadingButton} from "../LoadingButton/LoadingButton";
import {MessageContext, Messages} from "../Messages/Messages";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {ModalCloseable} from "../Modal/ModalCloseable";
import {UpdateContribution, updateContribution} from "../API/calls/Contribution";


export interface CollaboratorsProps {
    collaborators: SharedSaveResource[],
    deletable?: boolean,
    editable?: boolean
}

interface CollaboratorsComponentState {
    deletable: boolean,
    editable: boolean,
    showDeleteModal: boolean,
    selectedCollaborator: SharedSaveResource | null,
    isDeleting: boolean,
    isEditing: boolean
}

class CollaboratorsTableComponent extends Component<CollaboratorsProps, CollaboratorsComponentState> {
    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = MessageContext;
    context!: React.ContextType<typeof MessageContext>

    state = {
        deletable: false,
        editable: false,
        showDeleteModal: false,
        selectedCollaborator: null,
        isDeleting: false,
        isEditing: false
    };

    static getDerivedStateFromProps(props: CollaboratorsProps, state: CollaboratorsComponentState) {
        return {
            deletable: props.deletable ?? false,
            editable: props.editable ?? false
        };
    }

    render() {
        if (this.props.collaborators.length <= 0) {
            return (
                <span>
                    Keine Kollaboratoren vorhanden...
                </span>
            );
        }

        return (
            <>
                <div className={"collaborators-container"}>
                    <Table hover>
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Berechtigung</th>
                            {this.state.deletable && <th/>}
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.collaborators.filter((value) => {
                            return value.accepted && !value.revoked;
                        }).map((value) => {
                            return (
                                <tr key={`collaboration-component-tr-${value.id}`}>
                                    <td>{value.user.username}</td>
                                    <td>
                                        {this.state.editable ? (
                                            <FormSelect
                                                disabled={this.state.isEditing || this.state.isDeleting}
                                                defaultValue={value.permission}
                                                onChange={async (e) => {
                                                    await this.changePermission(value, Number(e.target.value));
                                                }}
                                                size={"sm"}
                                            >
                                                {getSharedSavePermissionOptions()}
                                            </FormSelect>
                                        ) : getSharedSavePermissionText(value.permission)}
                                    </td>
                                    {this.state.deletable && (
                                        <td>
                                            <Button
                                                disabled={this.state.isEditing || this.state.isDeleting}
                                                onClick={() => {
                                                    this.setState({
                                                        showDeleteModal: true,
                                                        selectedCollaborator: value
                                                    });
                                                }}
                                                variant={"danger"}
                                                size={"sm"}
                                            >
                                                <FAE icon={faTrash}/>
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>

                    {this.state.deletable && (
                        <ModalCloseable
                            backdrop centered
                            className={"third-modal"}
                            backdropClassName={"third-modal-backdrop"}
                            show={this.state.showDeleteModal}
                            onHide={() => {
                                this.setState({
                                    showDeleteModal: false,
                                    selectedCollaborator: null,
                                    isDeleting: false
                                });
                            }}
                        >
                            <Modal.Header>
                                <h5>Sind Sie Sicher?</h5>
                            </Modal.Header>
                            <Modal.Body>
                                Der Kollaborateur wird vom Speicherstand entfernt.<br/>
                            </Modal.Body>
                            <Modal.Footer>
                                <LoadingButton
                                    variant={"danger"}
                                    onClick={async () => {
                                        if (this.state.selectedCollaborator !== null) {
                                            this.setState({
                                                isDeleting: true
                                            });

                                            await this.deleteCollaborator(this.state.selectedCollaborator);
                                        }

                                        this.setState({
                                            showDeleteModal: false,
                                            selectedCollaborator: null,
                                            isDeleting: false
                                        });
                                    }}
                                    defaultChild={"Entfernen"}
                                    savingChild={"Wird entfernt..."}
                                    defaultIcon={faTimes}
                                    isLoading={this.state.isDeleting}
                                />

                                <Button
                                    variant={"primary"}
                                    onClick={() => {
                                        this.setState({
                                            showDeleteModal: false,
                                            selectedCollaborator: null,
                                            isDeleting: false
                                        });
                                    }}
                                >
                                    Abbrechen
                                </Button>
                            </Modal.Footer>
                        </ModalCloseable>
                    )}
                </div>
            </>
        );
    }

    private async changePermission(save: SharedSaveResource, permission: SharedSavePermission) {
        this.setState({
            isEditing: true
        });

        let data: UpdateContribution = {
            permission: permission,
            revoked: false
        };

        let call = await updateContribution(save.id, data);
        if (call && call.success) {
            this.context.add("Berechtigung geändert", "SUCCESS", Messages.TIMER);
        }

        this.setState({
            isEditing: false
        });
    }

    private async deleteCollaborator(save: SharedSaveResource) {
        this.setState({
            isDeleting: true
        });

        let data: UpdateContribution = {
            permission: save.permission,
            revoked: true
        };

        let call = await updateContribution(save.id, data);
        if (call && call.success) {
            this.context.add("Kollaborateur entfernt!", "SUCCESS", Messages.TIMER);
        }

        this.setState({
            isDeleting: false
        });
    }

}

export {
    CollaboratorsTableComponent
}
