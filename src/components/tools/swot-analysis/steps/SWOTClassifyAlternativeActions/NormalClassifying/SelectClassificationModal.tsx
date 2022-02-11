import {
    ClassificationValues,
    ClassifiedAlternateAction
} from "../SWOTClassifyAlternativeActionsComponent";
import {Button, FormSelect, Modal} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


interface SelectClassificationModalProps {
    action?: ClassifiedAlternateAction
    /**
     * if the modal is open and visible
     */
    open: boolean
    classifications: ClassificationValues[]
    /**
     * Callback wenn eine Klassifikation gewählt wurde
     *
     * oldClassification wird null, wenn die aktion vorher noch keine Klassifikation hatte
     * newClassification wird null, wenn die Klassifikation der aktion entfernt wurde
     * @param oldClassification alte Klassifikation
     * @param newClassification neue Klassifikation
     * @param action Die Aktion bei der die Klassifikation geändert wird
     */
    onSelect: (
        oldClassification: ClassificationValues | null,
        newClassification: ClassificationValues | null,
        action: ClassifiedAlternateAction
    ) => void
    /**
     * callback wenn das Model geschlossen werden soll
     */
    onClose: () => void
    withNone: boolean
}


function SelectClassificationModal(props: SelectClassificationModalProps) {

    const findClassification = (action: ClassifiedAlternateAction): ClassificationValues | null => {
        for (const classification of props.classifications) {
            for (const classificationAction of classification.actions) {
                if (classificationAction === action) {
                    return classification;
                }
            }
        }
        return null;
    }

    return (
        <Modal
            show={props.open}
            backdrop={true}
            onHide={props.onClose}
            keyboard={true}
        >
            <Modal.Header>
                <Modal.Title>
                    Zuweisung
                    <Button
                        type={"button"}
                        variant={"light"}
                        onClick={props.onClose}
                    >
                        <FontAwesomeIcon icon={faTimes}/>
                    </Button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Weisen Sie die Handlungsalternative einer Klassifikation zu.<br/><br/>

                <FormSelect
                    onChange={(e) => {
                        if (e.target instanceof HTMLSelectElement) {
                            let option = e.target.selectedOptions[0];

                            const droppableID = option.value;
                            const value = droppableID;
                            let classification = props.classifications.find(classification => classification.droppableID === droppableID);

                            if (props.action) {
                                let foundClassification = findClassification(props.action);
                                let oldClassification: ClassificationValues | null = null;
                                let newClassification: ClassificationValues | null = null;

                                if (foundClassification) {
                                    if (value === "_none") {
                                        oldClassification = foundClassification
                                    } else {
                                        oldClassification = foundClassification
                                        // convert from undefined union type to null union type
                                        newClassification = classification ?? null
                                    }
                                } else {
                                    newClassification = classification ?? null
                                }
                                props.onSelect(oldClassification, newClassification, props.action)
                            }

                        }
                        props.onClose();
                    }}
                    multiple={false}
                >
                    <option disabled={true} selected value={"none"}>--- Auswählen ---</option>

                    {(props.withNone) && (
                        <option value={"_none"}>Keine Klassifikation</option>
                    )}

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
