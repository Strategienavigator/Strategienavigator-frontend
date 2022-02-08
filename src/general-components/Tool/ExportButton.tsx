import {Button, FormSelect, Modal} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExport, faTimes} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {Tool} from "./Tool";
import {Exporter} from "../Export/Exporter";
import {Messages} from "../Messages/Messages";

interface ExportModalProps {
    onClose: () => void
    onSelect: (exporter: Exporter<any>) => void
    show: boolean
    tool: Tool
}

function ExportModal(props: ExportModalProps) {
    return (
        <Modal
            show={props.show}
            backdrop={true}
            onHide={() => {
                props.onClose();
            }}
            keyboard={true}
        >
            <Modal.Header>
                <Modal.Title>
                    Exportieren
                    <Button
                        type={"button"}
                        variant={"light"}
                        onClick={() => {
                            props.onClose();
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormSelect
                    onChange={(e) => {
                        let exporter = props.tool.getExporters().find((ex) => {
                            return ex.getName() === e.target.value;
                        });
                        if (exporter) {
                            props.onSelect(exporter);
                        }
                        props.onClose();
                    }}
                    multiple={false}
                >
                    <option disabled={true} selected value={"none"}>--- Auswählen ---</option>
                    {props.tool.getExporters().map((exporter) => {
                        let name = exporter.getName();
                        return (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        );
                    })}
                </FormSelect>
            </Modal.Body>
        </Modal>
    );
}

interface ExportButtonProps {
    tool: Tool
    onClick: () => void
}

function ExportButton(props: ExportButtonProps) {
    return (
        <>
            <Button
                variant={"dark"}
                className={"mt-2"}
                onClick={() => {
                    props.onClick();
                }}
            >
                <FontAwesomeIcon icon={faFileExport} /> Exportieren
            </Button>
        </>
    );
}

export {
    ExportButton,
    ExportModal
}
