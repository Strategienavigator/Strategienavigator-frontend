import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import React, {FormEvent} from "react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SWOTAlternativeActionsValues} from "./SWOTAlternativeActions";
import {CardComponentField} from "../../../../general-components/CardComponent/CardComponent";


interface ClassifiedAlternateAction {
    name: string
    index: number
    indexName: string
    alreadyAdded: boolean
    action: CardComponentField
}

type Classification = {
    droppableID: string,
    name: string | null,
    actions: Map<string, ClassifiedAlternateAction>
}

export interface SWOTClassifyAlternativeActionsValues {
    classifications: Classification[]
}

class SWOTClassifyAlternativeActions extends FormComponent<SWOTClassifyAlternativeActionsValues, any> {
    private actions = new Map<string, ClassifiedAlternateAction>();
    private classifications = new Map<string, Classification>();
    private noneDroppableID = "classifications-draggables";
    private maxClassifications = 10;

    onDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (source.droppableId === this.noneDroppableID) {
            let action = this.getAction(draggableId);
            let classification = this.getClassification(destination.droppableId);
            if (classification !== undefined && action !== undefined) {
                action.alreadyAdded = true;
                classification.actions.set(action?.indexName, action);
                classification.actions = this.sortActionMap(classification.actions);
            }
        } else if (source.droppableId !== destination.droppableId) {
            let action = this.getAction(draggableId);
            let classification = this.getClassification(destination.droppableId);
            if (classification !== undefined && action !== undefined) {
                this.removeAction(source.droppableId, draggableId);
                action.alreadyAdded = true;
                classification.actions.set(action?.indexName, action);
                classification.actions = this.sortActionMap(classification.actions);
            }
        }
    }

    sortActionMap = (map: Map<string, ClassifiedAlternateAction>): Map<string, ClassifiedAlternateAction> => {
        return new Map(Array.from(map).sort());
    }

    onReset = (type: ResetType) => {
        this.classifications.clear();
        this.actions.clear();
        if (type.same) {
            this.buildPreviousValues();
            this.forceUpdate();
        }
    }

    addClassification = (droppableID: string | undefined) => {
        if (this.maxClassifications < this.classifications.size) {
            return;
        }

        if (droppableID === undefined) {
            droppableID = "droppable-" + 0;
        } else {
            let splitted = droppableID.split("-");
            let newIndex = parseInt(splitted[1]) + 1;
            droppableID = "droppable-" + newIndex;
        }

        let classification: Classification = {
            actions: new Map<string, ClassifiedAlternateAction>(),
            name: null,
            droppableID: droppableID
        };
        this.classifications.set(droppableID, classification);

        this.forceUpdate();
    }

    getClassification = (droppableID: string): Classification | undefined => {
        return this.classifications.get(droppableID);
    }

    removeClassification = (droppableID: string): boolean => {
        let classification = this.classifications.get(droppableID);
        classification?.actions.forEach((value) => {
            value.alreadyAdded = false;
        });
        let deleted = this.classifications.delete(droppableID);
        this.forceUpdate();
        return deleted;
    }

    getAction = (draggableID: string): ClassifiedAlternateAction | undefined => {
        return this.actions.get(draggableID);
    }

    removeAction = (droppableID: string, draggableID: string): boolean => {
        let classification = this.getClassification(droppableID);
        if (classification) {
            let action = classification.actions.get(draggableID);
            if (action) {
                action.alreadyAdded = false;
                let deleted = classification.actions.delete(draggableID);
                this.forceUpdate();
                return deleted;
            }
        }
        return false;
    }

    onClassificationNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, droppableID: string) => {
        let value = e.currentTarget.value;
        let classification = this.getClassification(droppableID);
        if (classification) {
            classification.name = value;
        }
    }

    build(): JSX.Element {
        let lastDropID: string;
        let i = -1;

        if (this.actions.size <= 0) {
            return (
                <Card body>
                    Es sind Keine Handlungsalternativen vorhanden...
                </Card>
            );
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {
                    Array.from(this.classifications.values()).map((classification) => {
                        let e = -1;
                        let droppableID = classification.droppableID;
                        lastDropID = droppableID;

                        return (
                            <Droppable direction={"horizontal"} key={droppableID} droppableId={droppableID}>
                                {(provided, snapshot) => {
                                    let dropZoneClassNames = ["dropzone", "actionRow"];

                                    if (snapshot.isDraggingOver) {
                                        dropZoneClassNames.push("isDraggingOver");
                                    }
                                    if (classification.actions.has(snapshot.draggingOverWith as string)) {
                                        dropZoneClassNames.push("alreadyDropped");
                                    }

                                    return (
                                        <div
                                            className={"classification"}
                                        >
                                            <InputGroup>
                                                <FormControl
                                                    type={"text"}
                                                    required={true}
                                                    disabled={this.disabled}
                                                    onChange={(e) => this.onClassificationNameChange(e, droppableID)}
                                                    placeholder={"Klassifikation"}
                                                />
                                                {!this.disabled && (
                                                    <Button
                                                        onClick={() => this.removeClassification(droppableID)}
                                                        variant={"link"}
                                                        className={"xButton"}>
                                                        <FontAwesomeIcon icon={faTimes}/>
                                                    </Button>
                                                )}
                                            </InputGroup>

                                            {this.getError(droppableID + "-classification")}

                                            <Row
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={dropZoneClassNames.join(" ")}
                                            >
                                                {(classification.actions.size <= 0 && !snapshot.isDraggingOver) && (
                                                    <small>
                                                        Hierhin ziehen...
                                                    </small>
                                                )}

                                                {Array.from(classification.actions.values()).map((action) => {
                                                    e++;

                                                    return (
                                                        <Draggable isDragDisabled={this.disabled}
                                                                   key={action.indexName}
                                                                   draggableId={action.indexName}
                                                                   index={e}>
                                                            {(provided) => {
                                                                return (
                                                                    <Col
                                                                        className={"actionCol"}
                                                                        key={action.indexName}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <Card className={"actionCard"}>
                                                                            <Card.Body as={Row}
                                                                                       className={"displayAction"}>
                                                                                <Col className={"text"}>
                                                                                    <b>{action.name}</b> {action.action.name}
                                                                                </Col>
                                                                                {!this.disabled && (
                                                                                    <Col
                                                                                        onClick={() => this.removeAction(droppableID, action.indexName)}
                                                                                        className={"icon"}>
                                                                                        <FontAwesomeIcon
                                                                                            icon={faTimes}/>
                                                                                    </Col>
                                                                                )}
                                                                            </Card.Body>
                                                                        </Card>
                                                                    </Col>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}

                                                {this.getError(droppableID + "-action-size")}
                                            </Row>
                                        </div>
                                    );
                                }}
                            </Droppable>
                        );
                    })
                }

                {(!this.disabled && (this.maxClassifications > this.classifications.size)) && (
                    <Button onClick={() => this.addClassification(lastDropID)} className={"addClassification"}>
                        <FontAwesomeIcon icon={faPlus} color={"white"}/>
                    </Button>
                )}

                <Droppable direction={"horizontal"} isDropDisabled={true} droppableId={this.noneDroppableID}>
                    {(provided, snapshot) => (
                        <div className={"actions"}>
                            <>
                                <span className={"withoutClassification"}>Ohne Klassifikation</span>

                                <hr/>

                                <Row
                                    className={"actionRow"}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {Array.from(this.actions.values()).map((value) => {
                                        i++;

                                        if (value.alreadyAdded) {
                                            return undefined;
                                        }

                                        return (
                                            <Draggable isDragDisabled={this.disabled} key={value.indexName}
                                                       draggableId={value.indexName} index={i}>
                                                {(provided2, snapshot2) => {
                                                    let classes = ["actionCol"];

                                                    if (!snapshot2.isDragging) {
                                                        classes.push("notDragging");
                                                    }

                                                    return (
                                                        <Col
                                                            ref={provided2.innerRef}
                                                            {...provided2.dragHandleProps}
                                                            {...provided2.draggableProps}
                                                            className={classes.join(" ")}
                                                        >
                                                            <Card body className={"actionCard"}>
                                                                <b>{value.name}</b> {value.action.name}
                                                            </Card>
                                                        </Col>
                                                    )
                                                }}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </Row>
                            </>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    extractValues(e: FormEvent<HTMLFormElement>): SWOTClassifyAlternativeActionsValues {
        let classifications: Classification[] = [];

        this.classifications.forEach((value) => {
            classifications.push(value);
        });

        return {
            classifications
        };
    }

    rebuildValues = async (values: SWOTClassifyAlternativeActionsValues) => {

    }

    buildPreviousValues = async () => {
        let previousStep = this.props.stepComp?.getPreviousStep<SWOTAlternativeActionsValues>();
        if (previousStep && this.actions.size <= 0) {
            for (let i = 0; i < previousStep.actions.length; i++) {
                let action = previousStep.actions[i];
                for (let e = 0; e < action.alternatives.length; e++) {
                    let indexName = action.name + "-" + e;

                    let newAction: ClassifiedAlternateAction = {
                        indexName: indexName,
                        index: e,
                        alreadyAdded: false,
                        name: action.name,
                        action: action.alternatives[e]
                    }
                    this.actions.set(indexName, newAction);
                }
            }
            this.forceUpdate();
        }
    }

    submit = async (values: SWOTClassifyAlternativeActionsValues) => {
    }

    validate(values: SWOTClassifyAlternativeActionsValues): boolean {
        let validated = true;

        for (let i = 0; i < values.classifications.length; i++) {
            let value = values.classifications[i];
            if (value.name === null || value.name === "") {
                this.addError(value.droppableID + "-classification", "Bitte ausfüllen!");
                validated = false;
            }
            if (value.actions.size <= 0) {
                this.addError(value.droppableID + "-action-size", "Die Klassifikation muss mindestens eine Handlungsalternative haben");
                validated = false;
            }
        }

        return validated;
    }

    changeControlFooter(): void {
    }

}

export {
    SWOTClassifyAlternativeActions
}
