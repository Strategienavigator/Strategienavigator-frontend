import React, {Component} from "react";
import {ClassifiedAlternateAction, SWOTClassifyAlternativeActions} from "../SWOTClassifyAlternativeActions";
import {Accordion, Button, Card, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisH, faPlus} from "@fortawesome/free-solid-svg-icons";

import "./normal-classifying.scss";
import {faTimes, faTrash} from "@fortawesome/free-solid-svg-icons/";
import {SelectClassificationModal} from "./SelectClassificationModal";


interface NormalClassifyingProps {
    step3instance: SWOTClassifyAlternativeActions
}

interface NormalClassifyingState {
    openClassificationModal: boolean
    lastSelectedAction: ClassifiedAlternateAction | null
}

class NormalClassifying extends Component<NormalClassifyingProps, NormalClassifyingState> {

    constructor(props: NormalClassifyingProps | Readonly<NormalClassifyingProps>) {
        super(props);

        this.state = {
            openClassificationModal: false,
            lastSelectedAction: null
        }
    }

    openClassificationModal(action: ClassifiedAlternateAction) {
        this.setState({
            openClassificationModal: true,
            lastSelectedAction: action
        });
    }

    render() {
        let lastDropID: string;

        return (
            <>
                <Accordion>
                    {Array.from(this.props.step3instance.getClassifications().values()).map((classification) => {
                        lastDropID = classification.droppableID;

                        return (
                            <Accordion.Item key={classification.droppableID}
                                            eventKey={classification.droppableID}>
                                <Accordion.Header>
                                    <InputGroup>
                                        <Button
                                            type={"button"}
                                            variant={"danger"}
                                            size={"sm"}
                                            onClick={() => this.props.step3instance.removeClassification(classification.droppableID)}
                                        >
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </Button>
                                        <FormControl
                                            type={"text"}
                                            placeholder={"Klassifikation..."}
                                            onChange={(e) => {
                                                this.props.step3instance.onClassificationNameChange(e, classification.droppableID);
                                            }}
                                            defaultValue={classification.name as string}
                                        />
                                    </InputGroup>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className={"actionCards"}>
                                        {Array.from(classification.actions.values()).map((action) => {
                                            return (
                                                <Card key={action.indexName} className={"actionCard"} body>
                                                    <Row>
                                                        <Col>{action.name}</Col>
                                                        <Col>{action.action.name}</Col>
                                                        <Col>
                                                            <Button
                                                                size={"sm"}
                                                                variant={"danger"}
                                                                onClick={() => {
                                                                    this.props.step3instance.removeAction(classification.droppableID, action.indexName);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faTimes}/>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                    {(classification.actions.size <= 0) && (
                                        <span>
                                            Keine Handlungsalternativen zugeordnet...
                                        </span>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>

                {(!this.props.step3instance.isDisabled() && (
                        this.props.step3instance.getMaxClassificationSize()
                        > this.props.step3instance.getClassifications().size)
                ) && (
                    <Button onClick={() => this.props.step3instance.addClassification(lastDropID)}
                            className={"addClassification"}>
                        <FontAwesomeIcon icon={faPlus} color={"white"}/>
                    </Button>
                )}

                <hr/>

                <div className={"actionCards"}>
                    {Array.from(this.props.step3instance.getActions().values()).map((action) => {
                        if (action.alreadyAdded) {
                            return;
                        }

                        return (
                            <Card key={action.indexName} className={"actionCard"} body>
                                <Row>
                                    <Col>{action.name}</Col>
                                    <Col>{action.action.name}</Col>
                                    <Col>
                                        <Button
                                            size={"sm"}
                                            onClick={() => {
                                                this.openClassificationModal(action);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faEllipsisH}/>
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}

                    {(Array.from(this.props.step3instance.getActions().values()).filter((v) => {
                        return !v.alreadyAdded;
                    }).length <= 0) && (
                        <span>
                            Alle zugeordnet!
                        </span>
                    )}
                </div>

                <SelectClassificationModal
                    open={this.state.openClassificationModal}
                    action={this.state.lastSelectedAction}
                    classifications={this.props.step3instance.getClassifications()}
                    onSelect={((classification, action) => {
                        action.alreadyAdded = true;
                        classification.actions.set(action?.indexName, action);
                        classification.actions = this.props.step3instance.sortActionMap(classification.actions);
                        this.forceUpdate();
                    })}
                    onClose={() => {
                        this.setState({
                            openClassificationModal: false,
                            lastSelectedAction: null
                        });
                    }}
                />
            </>
        )

    }

}

export {
    NormalClassifying
}
