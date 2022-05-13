import {Button, FormSelect, Modal} from "react-bootstrap";
import {faFileExport, faTimes} from "@fortawesome/free-solid-svg-icons";
import {memo} from "react";
import {Tool} from "./Tool";
import {Exporter} from "../Export/Exporter";
import FAE from "../Icons/FAE";


interface ExportModalProps {
    onClose: () => void
    onSelect: (exporter: Exporter<any>) => void
    show: boolean
    tool: Tool<any>
}

function ExportModalComponent(props: ExportModalProps) {
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
                        <FAE icon={faTimes}/>
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

const ExportModal = memo(ExportModalComponent);

interface ExportButtonProps {
    onClick: () => void
}

function ExportButton(props: ExportButtonProps) {
    return (
        <>
            <Button
                variant={"dark"}
                className={"mt-2"}
                onClick={props.onClick}
            >
                <FAE icon={faFileExport}/> Exportieren
            </Button>
        </>
    );
}

export {
    ExportButton,
    ExportModal
}
