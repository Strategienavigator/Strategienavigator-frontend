import React, {Component} from "react";
import {
    ClassificationController,
    ClassificationValues,
    ClassifiedAlternateAction
} from "../SWOTClassifyAlternativeActionsComponent";
import {Accordion, Button, Card, Col, FormControl, FormControlProps, InputGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExchangeAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from "@fortawesome/free-solid-svg-icons/";
import {SelectClassificationModal} from "./SelectClassificationModal";
import {SWOTClassifyAlternativeActions} from "../SWOTClassifyAlternativeActions";

import "./normal-classifying.scss";

interface NormalClassifyingProps extends FormControlProps {
    classificationController: ClassificationController
    classifications: ClassificationValues[]
    actions: ClassifiedAlternateAction[]
}

interface NormalClassifyingState {
    openClassificationModal: boolean
    lastSelectedAction?: ClassifiedAlternateAction
    withNone: boolean
}

class NormalClassifying extends Component<NormalClassifyingProps, NormalClassifyingState> {

    constructor(props: NormalClassifyingProps | Readonly<NormalClassifyingProps>) {
        super(props);

        this.state = {
            openClassificationModal: false,
            withNone: false
        }
    }


    render() {
        const classifications = this.props.classifications;
        const actions = this.props.actions;
        return (
            <>
                <Accordion>
                    {classifications.map((classification) => {

                        return (
                            <Accordion.Item key={classification.droppableID}
                                            eventKey={classification.droppableID}>
                                <Accordion.Header>
                                    <InputGroup>
                                        <Button
                                            as={"div"}
                                            type={"button"}
                                            variant={"danger"}
                                            size={"sm"}
                                            onClick={() => this.props.classificationController.removeClassification(classification.droppableID)}
                                        >
                                            <FontAwesomeIcon style={{verticalAlign: "middle"}} icon={faTrash}/>
                                        </Button>
                                        <FormControl
                                            type={"text"}
                                            placeholder={"Klassifikation..."}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                this.props.classificationController.classificationNameChanged(classification.droppableID, newName);
                                            }}
                                            value={classification.name}
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
                                                                onClick={() => {
                                                                    this.openClassificationModal(action, true);
                                                                    // this.props.step3instance.removeAction(classification.droppableID, action.indexName);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon rotation={90}
                                                                                 icon={faExchangeAlt}/>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                    {(classification.actions.length <= 0) && (
                                        <span>
                                            Keine Handlungsalternativen zugeordnet...
                                        </span>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        );
                    })}
                </Accordion>

                {(!this.props.disabled && (
                        SWOTClassifyAlternativeActions.maxClassifications
                        > classifications.length)
                ) && (
                    <Button onClick={this.props.classificationController.addClassification}
                            className={"addClassification"}>
                        <FontAwesomeIcon icon={faPlus} color={"white"}/>
                    </Button>
                )}

                <hr/>

                <div className={"actionCards"}>
                    {actions.filter(value => !value.alreadyAdded).map((action) => {

                        return (
                            <Card key={action.indexName} className={"actionCard"} body>
                                <Row>
                                    <Col>{action.name}</Col>
                                    <Col>{action.action.name}</Col>
                                    <Col>
                                        <Button
                                            size={"sm"}
                                            onClick={this.openClassificationModal.bind(this, action, undefined)}>
                                            <FontAwesomeIcon rotation={90} icon={faExchangeAlt}/>
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        );
                    })}

                    {(!actions.some((v) => !v.alreadyAdded)) && (
                        <span>Alle zugeordnet!</span>
                    )}
                </div>


                <SelectClassificationModal
                    open={this.state.openClassificationModal}
                    action={this.state.lastSelectedAction ?? undefined}
                    classifications={classifications}
                    onSelect={this.changeClassification}
                    onClose={this.closeClassificationModal}
                />
            </>
        )
    }

    private changeClassification = (oldClassification: ClassificationValues | null, newClassification: ClassificationValues | null, action: ClassifiedAlternateAction) => {
        this.props.classificationController.updateActionClassification(oldClassification?.droppableID ?? null, newClassification?.droppableID ?? null, action.indexName);
    }


    private closeClassificationModal = () => {
        this.setState({
            openClassificationModal: false,
            lastSelectedAction: undefined
        });
    }


    private openClassificationModal = (action: ClassifiedAlternateAction, withNone?: boolean) => {
        this.setState({
            openClassificationModal: true,
            lastSelectedAction: action,
            withNone: !!withNone
        });
    }


}

export {
    NormalClassifying
}
