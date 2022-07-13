import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {SimpleSaveResource} from "../../../Datastructures";
import {Loader} from "../../../Loader/Loader";
import { ModalCloseable } from "../../../Modal/ModalCloseable";


interface DeleteSaveModalProps {
    show: boolean,
    save: SimpleSaveResource | null,
    onClose: () => void,
    onDelete: (id: number) => Promise<void>,
}

function DeleteSaveModal(props: DeleteSaveModalProps) {
    let [loadingDelete, setLoadingDelete] = useState(false);

    return (
        <ModalCloseable
            show={props.show}
            onHide={props.onClose}
            backdrop="static"
            centered
            keyboard={true}
        >
            <Modal.Header>
                <Modal.Title>Analyse löschen?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Wollen Sie wirklich Ihre Analyse "{props.save?.name}" löschen?
                <br/>
                Dieser Vorgang kann <b>NICHT</b> rückgängig gemacht werden!
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={loadingDelete} onClick={async () => {
                    setLoadingDelete(true);
                    await props.onDelete(props.save?.id as number);
                    setLoadingDelete(false);
                }} variant={"danger"}>
                    <Loader payload={[]} transparent size={25} text={"Endgültig löschen"} variant={"dark"}
                            loaded={!loadingDelete}>
                        Endgültig löschen
                    </Loader>
                </Button>
                <Button disabled={loadingDelete} onClick={props.onClose} variant={"dark"}>
                    Abbrechen
                </Button>
            </Modal.Footer>
        </ModalCloseable>
    );
}

export {
    DeleteSaveModal
}