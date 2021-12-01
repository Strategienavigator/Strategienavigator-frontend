import {Classification, ClassifiedAlternateAction} from "../SWOTClassifyAlternativeActions";
import {Button, FormSelect, Modal} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


interface SelectClassificationModalProps {
    action?: ClassifiedAlternateAction
    open: boolean
    classifications: Map<string, Classification>
    onNoneSelect: (
        oldClassification: Classification,
        action: ClassifiedAlternateAction
    ) => void
    onSelectOther: (
        oldClassification: Classification,
        newClassification: Classification,
        action: ClassifiedAlternateAction
    ) => void
    onSelect: (
        classification: Classification,
        action: ClassifiedAlternateAction
    ) => void
    onClose: () => void
    withNone: boolean
}


function SelectClassificationModal(props: SelectClassificationModalProps) {

    const findClassification = (action: ClassifiedAlternateAction): Classification | null => {
        for (const classification of Array.from(props.classifications.values())) {
            for (const classificationAction of Array.from(classification.actions.values())) {
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
                        let option = e.target.selectedOptions[0];
                        let droppableID, value;
                        droppableID = value = option.value;
                        let classification = props.classifications.get(droppableID);

                        if (props.action){
                            let foundClassification = findClassification(props.action);

                            if (foundClassification) {
                                if (value === "_none") {
                                    props.onNoneSelect(
                                        foundClassification as Classification,
                                        props.action
                                    );
                                } else {
                                    props.onSelectOther(
                                        foundClassification as Classification,
                                        classification as Classification,
                                        props.action
                                    );
                                }
                            } else {
                                props.onSelect(
                                    classification as Classification,
                                    props.action
                                );
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
