import {ModalCloseable} from "../../Modal/ModalCloseable";
import {Badge, Button, Modal} from "react-bootstrap";
import {SharedSaveResource} from "../../Datastructures";
import {CollaboratorsTableComponent} from "../../CollaboratorsComponent/CollaboratorsTableComponent";


interface CollaboratorsModalProps {
    show: boolean,
    onClose: () => void,
    contributors: SharedSaveResource[]
}

function CollaboratorsModal(props: CollaboratorsModalProps) {
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
            fullscreen={"md-down"}
        >
            <Modal.Header>
                <h5>Alle aktuellen Kollaborateure <Badge bg={"dark"} pill>{props.contributors.filter((v) => {
                    return v.accepted && !v.revoked;
                }).length}</Badge></h5>
            </Modal.Header>
            <Modal.Body>
                <CollaboratorsTableComponent
                    collaborators={props.contributors}
                    editable
                    deletable
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    size={"sm"}
                    onClick={() => props.onClose()}
                >
                    Zurück
                </Button>
            </Modal.Footer>
        </ModalCloseable>
    );
}

export {
    CollaboratorsModal
}