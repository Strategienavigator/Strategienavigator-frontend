import React, {ChangeEvent, Component, MouseEvent} from "react";
import {Accordion, Button, FormControl, InputGroup} from "react-bootstrap";
import FAE from "../../../../../../../general-components/Icons/FAE";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {ClassifyingCardList} from "../../ModalClassifying/ClassifyingCardList/ClassifyingCardList";
import {
    ClassificationController,
    ClassificationValues,
    ClassifiedAlternateAction
} from "../../SWOTClassifyAlternativeActionsComponent";
import {SWOTClassifyAlternativeActions} from "../../SWOTClassifyAlternativeActions";


interface ClassificationAccordionsProps {
    actions: ClassifiedAlternateAction[],
    classifications: ClassificationValues[],
    classificationController: ClassificationController
    onClassificationClick: (id: string) => void,
    disabled: boolean,
    cardElement: JSX.Element
}

class ClassificationAccordions extends Component<ClassificationAccordionsProps, any> {

    onNameChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const id = event.currentTarget.name;
        const newName = event.target.value;

        if (id.startsWith("droppable-")) {
            this.props.classificationController.classificationNameChanged(id, newName);
        }
    }

    onRemove = (event: MouseEvent<HTMLButtonElement>) => {
        const id = event.currentTarget.name;
        this.props.classificationController.removeClassification(id);
    }

    render = () => {
        return (
            <>
                <Accordion>
                    {this.props.classifications.map((classification) => {

                        return (
                            <Accordion.Item key={classification.droppableID}
                                            eventKey={classification.droppableID}>
                                <Accordion.Header>
                                    <InputGroup>
                                        {(!this.props.disabled) && (
                                            <Button
                                                variant={"danger"}
                                                size={"sm"}
                                                name={classification.droppableID}
                                                onClick={this.onRemove}
                                            >
                                                <FAE style={{verticalAlign: "middle"}} icon={faTrash}/>
                                            </Button>
                                        )}

                                        <FormControl
                                            type={"text"}
                                            name={classification.droppableID}
                                            disabled={this.props.disabled}
                                            placeholder={"Klassifikation..."}
                                            onChange={this.onNameChanged}
                                            value={classification.name}
                                        />
                                    </InputGroup>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ClassifyingCardList
                                        disabled={this.props.disabled}
                                        actions={classification.actions}
                                        onClassificationClick={this.props.onClassificationClick}
                                        cardElement={this.props.cardElement}
                                    />
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>

                {(this.props.disabled && this.props.classifications.length <= 0) && (
                    <span>
                        Keine Klassifikationen vorhanden...
                    </span>
                )}

                {(!this.props.disabled && (
                        SWOTClassifyAlternativeActions.maxClassifications
                        > this.props.classifications.length)
                ) && (
                    <Button onClick={this.props.classificationController.addClassification}
                            className={"addClassification"}>
                        <FAE icon={faPlus} color={"white"}/>
                    </Button>
                )}

                <hr/>

                <ClassifyingCardList
                    text={"Alle zugeordnet..."}
                    actions={this.props.actions.filter(value => !value.alreadyAdded)}
                    onClassificationClick={this.props.onClassificationClick}
                    disabled={this.props.disabled}
                    cardElement={this.props.cardElement}
                />
            </>
        );
    }
}

export {
    ClassificationAccordions
}
