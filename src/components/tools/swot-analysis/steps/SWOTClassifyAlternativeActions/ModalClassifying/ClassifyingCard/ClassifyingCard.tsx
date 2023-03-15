import React, {PureComponent} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import {faEllipsisH} from "@fortawesome/free-solid-svg-icons";
import {ClassifiedAlternateAction} from "../../SWOTClassifyAlternativeActionsComponent";
import FAE from "../../../../../../../general-components/Icons/FAE";
import {HoverWindow} from "../../../../../../../general-components/HoverWindow/HoverWindow";


interface ClassifyingCardProps {
    action?: ClassifiedAlternateAction
    onChangeClick?: (indexName: string) => void
    disabled?: boolean
}

class ClassifyingCard extends PureComponent<ClassifyingCardProps, {}> {

    render() {
        const action = this.props.action;

        return (
            <HoverWindow description={action?.action.desc}>
                <Card key={action?.indexName} className={"actionCard"} body>
                    <Row>
                        <Col>{action?.name}</Col>
                        <Col>{action?.action.name}</Col>
                        <Col>
                            {(!this.props.disabled) && (
                                <Button
                                    size={"sm"}
                                    onClick={this.onClick}>
                                    <FAE icon={faEllipsisH}/>
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card>
            </HoverWindow>
        );
    }

    private onClick = () => {
        if (this.props.action !== undefined && this.props.onChangeClick !== undefined) {
            this.props.onChangeClick(this.props.action.indexName);
        }
    };

}

export type{
    ClassifyingCardProps
}
export {
    ClassifyingCard
}
