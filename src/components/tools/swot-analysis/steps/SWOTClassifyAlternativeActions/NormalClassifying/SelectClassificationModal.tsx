import {Classification, ClassifiedAlternateAction} from "../SWOTClassifyAlternativeActions";
import {Button, FormSelect, Modal} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


interface SelectClassificationModalProps {
    action: ClassifiedAlternateAction | null
    open: boolean
    classifications: Map<string, Classification>
    onSelect: (classification: Classification, action: ClassifiedAlternateAction) => void
    onClose: () => void
}


function SelectClassificationModal(props: SelectClassificationModalProps) {
    return (
        <Modal
            show={props.open}
            backdrop={true}
            onHide={() => {
                props.onClose();
            }}
            keyboard={true}
        >
            <Modal.Header>
                <Modal.Title>
                    Zuweisung
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
                Weisen Sie die Handlungsalternative einer Klassifikation zu.<br/><br/>

                <FormSelect
                    onChange={(e) => {
                        if(e.target instanceof HTMLSelectElement){
                            let option = e.target.selectedOptions[0];
                            let droppableID = option.value;
                            let classification = props.classifications.get(droppableID);

                            if (classification) {
                                props.onSelect(classification, props.action as ClassifiedAlternateAction);
                            }
                            props.onClose();
                        }
                    }}
                    multiple={false}
                >
                    <option disabled={true} selected value={"none"}>--- Auswählen ---</option>
                    {Array.from(props.classifications.values()).map((classification) => {
                        let name = classification.name;

                        if (name) {
                            return (
                                <option key={"option" + name} value={classification.droppableID}>{name}</option>
                            );
                        }
                        return;
                    })}
                </FormSelect>
            </Modal.Body>
        </Modal>
    );
}

export {
    SelectClassificationModal
}
