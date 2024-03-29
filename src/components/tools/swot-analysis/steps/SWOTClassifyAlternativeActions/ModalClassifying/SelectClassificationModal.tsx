import {ClassificationValues} from "../SWOTClassifyAlternativeActionsComponent";
import {Button, FormSelect, Modal} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import FAE from "../../../../../../general-components/Icons/FAE";
import {ModalCloseable} from "../../../../../../general-components/Modal/ModalCloseable";


interface SelectClassificationModalProps {
    action?: string
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
        action: string
    ) => void
    /**
     * callback wenn das Model geschlossen werden soll
     */
    onClose: () => void
}

export function findClassification(action: string | undefined, classifications: ClassificationValues[]): ClassificationValues | null {
    if (action === undefined)
        return null;
    for (const classification of classifications) {
        for (const classificationAction of classification.actions) {
            if (classificationAction.indexName === action) {
                return classification;
            }
        }
    }
    return null;
}

function SelectClassificationModal(props: SelectClassificationModalProps) {
    const foundClassification = findClassification(props.action, props.classifications);

    return (
        <ModalCloseable
            show={props.action !== undefined && props.open}
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
                        <FAE icon={faTimes}/>
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
                            let classification = props.classifications.find(classification => classification.droppableID === droppableID);

                            if (props.action) {
                                let oldClassification: ClassificationValues | null = null;
                                let newClassification: ClassificationValues | null;

                                if (foundClassification) {
                                    oldClassification = foundClassification;
                                }

                                // classification must be undefined if _none is selected as destination classification
                                newClassification = classification ?? null;
                                props.onSelect(oldClassification, newClassification, props.action)
                            }

                        }
                        props.onClose();
                    }}
                    multiple={false}
                >

                    <option selected={foundClassification === undefined} value={"_none"}>Keine Klassifikation
                    </option>

                    {props.classifications.filter(c => c.name.length > 0).map((classification) => {
                        let name = classification.name;

                        return (
                            <option selected={classification.droppableID === foundClassification?.droppableID}
                                    key={"option" + name}
                                    value={classification.droppableID}>{name}</option>
                        );
                    })}
                </FormSelect>
            </Modal.Body>
        </ModalCloseable>
    );


}

export {
    SelectClassificationModal
}
