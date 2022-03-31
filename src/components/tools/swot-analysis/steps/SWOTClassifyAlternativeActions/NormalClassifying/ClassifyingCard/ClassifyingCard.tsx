import React, {PureComponent} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {faArrowsAlt, faExchangeAlt} from "@fortawesome/free-solid-svg-icons";
import {ClassifiedAlternateAction} from "../../SWOTClassifyAlternativeActionsComponent";
import FAE from "../../../../../../../general-components/Icons/FAE";
import {HoverWindow} from "../../../../../../../general-components/HoverWindow/HoverWindow";

interface ClassifyingCardProps {
    action: ClassifiedAlternateAction
    onChangeClick: (indexName: string) => void
}

class ClassifyingCard extends PureComponent<ClassifyingCardProps, {}> {


    render() {
        const action = this.props.action;
        return (
            <HoverWindow description={action.action.desc}>
                <Card key={action.indexName} className={"actionCard"} body>
                    <Row>
                        <Col>{action.name}</Col>
                        <Col>{action.action.name}</Col>
                        <Col>
                            <Button
                                size={"sm"}
                                onClick={this.onClick}>
                                <FAE rotation={90} icon={faArrowsAlt}/>
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </HoverWindow>
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
