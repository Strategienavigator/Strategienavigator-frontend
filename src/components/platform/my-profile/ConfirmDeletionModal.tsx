import {ModalCloseable} from "../../../general-components/Modal/ModalCloseable";
import {Button, Modal} from "react-bootstrap";
import React from "react";

export interface ConfirmDeletionModalProps {
    show: boolean,
    hideCallback: () => void,
    deleteCallback: () => void
}


export function ConfirmDeletionModal({
                                         show,
                                         hideCallback,
                                         deleteCallback
                                     }: ConfirmDeletionModalProps) {
    return <ModalCloseable
        show={show}
        backdrop="static"
        onHide={hideCallback}
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
            <Button variant={"light"} onClick={hideCallback}>
                Abbrechen
            </Button>
            <Button variant="dark" onClick={deleteCallback}>
                Ja, Account löschen!
            </Button>
        </Modal.Footer>
    </ModalCloseable>;
}