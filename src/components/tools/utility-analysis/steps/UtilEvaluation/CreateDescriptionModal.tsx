import {Button, Modal, Table} from "react-bootstrap";
import React from "react";
import {UACriteriaCustomDescriptionValues} from "../UtilCriterias/UACriteriaCustomDescription";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import FAE from "../../../../../general-components/Icons/FAE";
import "./create-description-modal.scss";
import {ModalCloseable} from "../../../../../general-components/Modal/ModalCloseable";


interface CreateDescriptionModalProps {
    show: boolean
    values: UACriteriaCustomDescriptionValues
    onClose: () => void
}

function CreateDescriptionModal(props: CreateDescriptionModalProps) {
    return (
        <>
            <ModalCloseable
                show={props.show}
                centered
                size={"lg"}
                keyboard={true}
                onHide={props.onClose}
                className={"scaleModal"}
            >
                <Modal.Body>
                    <div className={"test"}>
                        <Table striped variant={"light"} bordered hover>
                            <thead>
                            <tr>
                                <th>Skala</th>
                                <th>Beschreibung</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.values.headers.map((v, index) => {
                                return (
                                    <tr
                                        key={"custom-description-modal-" + v.header + "-" + index}
                                        aria-disabled={true}
                                    >
                                        <td className={"header"}>{v.header}</td>
                                        <td className={"desc"}>{v.desc}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>

                        <Button
                            onClick={props.onClose}
                            className={"closeButton"}
                        >
                            <FAE icon={faTimes}/>
                        </Button>
                    </div>
                </Modal.Body>
            </ModalCloseable>
        </>
    );
}

export {
    CreateDescriptionModal
}
