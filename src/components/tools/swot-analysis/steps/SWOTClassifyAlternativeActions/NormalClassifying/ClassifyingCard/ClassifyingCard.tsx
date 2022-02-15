import React, {PureComponent} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import {ClassifiedAlternateAction} from "../../SWOTClassifyAlternativeActionsComponent";

interface ClassifyingCardProps {
    action: ClassifiedAlternateAction
    onChangeClick: (indexName: string) => void
}

class ClassifyingCard extends PureComponent<ClassifyingCardProps, {}> {


    render() {
        const action = this.props.action;
        return (
            <Card key={action.indexName} className={"actionCard"} body>
                <Row>
                    <Col>{action.name}</Col>
                    <Col>{action.action.name}</Col>
                    <Col>
                        <Button
                            size={"sm"}
                            onClick={this.onClick}>
                            <FontAwesomeIcon rotation={90} icon={faExchangeAlt}/>
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    }

    private onClick = () => {
        this.props.onChangeClick(this.props.action.indexName);
    };

}

export type{
    ClassifyingCardProps
}
export {
    ClassifyingCard
}
