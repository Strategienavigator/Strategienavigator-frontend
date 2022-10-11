import {ModalCloseable} from "../../Modal/ModalCloseable";
import {Button, FloatingLabel, Form, FormGroup, FormSelect, Modal} from "react-bootstrap";
import {useState} from "react";
import {SharedSavePermission, UserSearchResultResource} from "../../Datastructures";
import {getSharedSavePermissionOptions} from "../../Save";


interface SingleInviteModalProps {
    show: boolean
    onClose: () => void
    user: UserSearchResultResource | null
    onInvite: (user: UserSearchResultResource | null, permission: SharedSavePermission) => void
}

function SingleInviteModal(props: SingleInviteModalProps) {
    let defaultPermission: SharedSavePermission = SharedSavePermission.READ;
    const [permission, setPermission] = useState<SharedSavePermission>(defaultPermission);

    return (
        <ModalCloseable
            show={props.show}
            className={"second-modal"}
            backdropClassName={"second-modal-backdrop"}
            centered
            onHide={() => {
                props.onClose();
            }}
            keyboard={true}
        >
            <Modal.Header>
                <h5><strong>{props.user?.username}</strong> einladen.</h5>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup className="mb-3">
                        <FloatingLabel label={"Berechtigung"}>
                            <FormSelect required={true} size={"sm"} defaultValue={defaultPermission} id={"permission"}
                                        onChange={(e) => {
                                            setPermission(parseInt(e.target.value) as SharedSavePermission);
                                        }}
                            >
                                {getSharedSavePermissionOptions()}
                            </FormSelect>
                        </FloatingLabel>
                    </FormGroup>

                    <Button
                        size={"sm"}
                        variant={"primary"}
                        onClick={() => {
                            props.onInvite(props.user, permission);
                            props.onClose();
                        }}
                    >Einladen</Button>
                </Form>
            </Modal.Body>
        </ModalCloseable>
    );
}

export {
    SingleInviteModal
}
