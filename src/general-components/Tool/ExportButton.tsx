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
            backdrop={"static"}
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
}

function ExportButton(props: ExportButtonProps) {
    let [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                variant={"dark"}
                className={"mt-2"}
                onClick={() => {
                    setShowModal(true);
                }}
            >
                <FontAwesomeIcon icon={faFileExport} />
                Exportieren
            </Button>

            <ExportModal
                onClose={() => {
                    setShowModal(false);
                }}
                onSelect={(exporter: Exporter<any>) => {
                    const save = props.tool.getCurrentSave();
                    if(save){
                        exporter.export(save);
                    }else{
                        Messages.add("Keine Daten vorhanden!","DANGER",Messages.TIMER);
                    }
                }}
                tool={props.tool}
                show={showModal}
            />
        </>
    );
}

export {
    ExportButton
}
