import {Component, memo} from "react";

import './reset-steps-modal.scss';
import {Button, Modal} from "react-bootstrap";


export interface ResetStepsModalProps {
    show: boolean,
    onYes: () => void,
    onNo: () => void,
    onAllReset: () => void
}

function ResetStepsModal(props: ResetStepsModalProps) {

        return (
            <Modal
                show={props.show}
                backdrop="static"
                keyboard={true}
            >
                <Modal.Header>
                    <Modal.Title>Sind Sie sich sicher?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Sind Sie sich sicher, dass Sie mit dem zurücksetzen fortfahren möchten?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={props.onNo}
                        variant={"light"}
                    >
                        Nein!
                    </Button>
                    <Button
                        variant="dark"
                        onClick={props.onAllReset}
                    >
                        Ja, ALLE Schritte zurücksetzen!
                    </Button>
                    <Button
                        variant="dark"
                        onClick={props.onYes}
                    >
                        Ja, ab diesem Schritt neu beginnen!
                    </Button>
                </Modal.Footer>
            </Modal>
        );
}

export default memo(ResetStepsModal)
