import {Button, Modal, Table} from "react-bootstrap";
import React from "react";
import {UACriteriaCustomDescriptionValues} from "../UACriteriaCustomDescription";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import FAE from "../../../../../../general-components/Icons/FAE";
import "./scale-description-modal.scss";
import {ModalCloseable} from "../../../../../../general-components/Modal/ModalCloseable";


interface CreateDescriptionModalProps {
    show: boolean
    values: UACriteriaCustomDescriptionValues
    onClose: () => void
}

function ScaleDescriptionModal(props: CreateDescriptionModalProps) {
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
                        <Table variant={"light"} bordered hover>
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
                                        className={(!props.values.activeIndices.includes(index + 1)) ? "tr-inactive" : ""}
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
    ScaleDescriptionModal
}
