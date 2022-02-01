import React, {Component} from "react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {SWOTClassifyAlternativeActionsComponent} from "./SWOTClassifyAlternativeActionsComponent";


interface DragAndDropClassifyingProps {
    step3Instance: SWOTClassifyAlternativeActionsComponent
}


class DragAndDropClassifying extends Component<DragAndDropClassifyingProps, any> {

    onDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;

        if (!destination) {
            return;
        }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (source.droppableId === this.props.step3Instance.getNoneDroppableID()) {
            let action = this.props.step3Instance.getAction(draggableId);
            let classification = this.props.step3Instance.getClassification(destination.droppableId);
            if (classification !== undefined && action !== undefined) {
                action.alreadyAdded = true;
                classification.actions.set(action?.indexName, action);
                classification.actions = this.props.step3Instance.sortActionMap(classification.actions);
            }
        } else if (source.droppableId !== destination.droppableId) {
            let action = this.props.step3Instance.getAction(draggableId);
            let classification = this.props.step3Instance.getClassification(destination.droppableId);
            if (classification !== undefined && action !== undefined) {
                this.props.step3Instance.removeAction(source.droppableId, draggableId);
                action.alreadyAdded = true;
                classification.actions.set(action?.indexName, action);
                classification.actions = this.props.step3Instance.sortActionMap(classification.actions);
            }
        }
    }

    render() {
        let lastDropID: string;
        let i = -1;

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                {
                    Array.from(this.props.step3Instance.getClassifications().values()).map((classification) => {
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
                                                    disabled={this.props.step3Instance.isDisabled()}
                                                    defaultValue={classification.name as string}
                                                    onChange={(e) => this.props.step3Instance.onClassificationNameChange(e, droppableID)}
                                                    placeholder={"Klassifikation"}
                                                />
                                                {!this.props.step3Instance.isDisabled() && (
                                                    <Button
                                                        onClick={() => this.props.step3Instance.removeClassification(droppableID)}
                                                        variant={"link"}
                                                        className={"xButton"}>
                                                        <FontAwesomeIcon icon={faTimes}/>
                                                    </Button>
                                                )}
                                            </InputGroup>

                                            {this.props.step3Instance.getError(droppableID + "-classification")}

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
                                                        <Draggable isDragDisabled={this.props.step3Instance.isDisabled()}
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
                                                                                {!this.props.step3Instance.isDisabled() && (
                                                                                    <Col
                                                                                        onClick={() => this.props.step3Instance.removeAction(droppableID, action.indexName)}
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

                                                {this.props.step3Instance.getError(droppableID + "-action-size")}
                                            </Row>
                                        </div>
                                    );
                                }}
                            </Droppable>
                        );
                    })
                }

                {(!this.props.step3Instance.isDisabled() && (
                    this.props.step3Instance.getMaxClassificationSize()
                    > this.props.step3Instance.getClassifications().size)
                ) && (
                    <Button onClick={() => this.props.step3Instance.addClassification(lastDropID)} className={"addClassification"}>
                        <FontAwesomeIcon icon={faPlus} color={"white"}/>
                    </Button>
                )}

                <Droppable direction={"horizontal"} isDropDisabled={true} droppableId={this.props.step3Instance.getNoneDroppableID()}>
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
                                    {Array.from(this.props.step3Instance.getActions().values()).map((value) => {
                                        i++;

                                        if (value.alreadyAdded) {
                                            return undefined;
                                        }

                                        return (
                                            <Draggable isDragDisabled={this.props.step3Instance.isDisabled()} key={value.indexName}
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
}

export {
    DragAndDropClassifying
}
