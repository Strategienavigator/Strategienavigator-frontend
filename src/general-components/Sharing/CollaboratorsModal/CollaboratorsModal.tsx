import {ModalCloseable} from "../../Modal/ModalCloseable";
import {Badge, Modal} from "react-bootstrap";
import {SharedSaveResource} from "../../Datastructures";
import {CollaboratorsComponent} from "../../CollaboratorsComponent/CollaboratorsComponent";


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
        >
            <Modal.Header>
                <h5>Alle aktuellen Kollaborateure <Badge bg={"dark"} pill>{props.contributors.filter((v) => {
                    return v.accepted;
                }).length}</Badge></h5>
            </Modal.Header>
            <Modal.Body>
                <CollaboratorsComponent collaborators={props.contributors}/>
            </Modal.Body>
        </ModalCloseable>
    );
}

export {
    CollaboratorsModal
}