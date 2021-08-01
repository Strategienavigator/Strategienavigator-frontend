import React, {Component} from "react";
import {Button, Col, Nav, NavItem, Row, Tab} from "react-bootstrap";

import "./step-component.scss";
import "./step-component-desk.scss";
import {isDesktop} from "../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons/faCaretRight";

interface SingleStep {
    callback: () => React.ReactElement
    title: string
}

class StepComponent<P, S> extends Component<P, S> {

    protected steps: Array<SingleStep> = [];
    protected currentStep: number = 1;
    protected progress: number = 1;

    private readonly header: string;

    constructor(props: any, header: string) {
        super(props);
        this.header = header;
    }

    render() {
        let i = 0
        let e = 0;

        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.getCurrentStep()}
                    transition={false}
                    onSelect={(e) => this.changeCurrentTab(e)}
                >
                    <Row className={"stepContainer"}>
                        <Col className={"stepTabContainer"}>

                            {(isDesktop()) ? (
                                <div className={"stepHeader"}>{this.header}</div>
                            ) : ""}

                            <Nav className={"stepTabs"}>
                                {this.steps.map((value) => {
                                    i++;
                                    return (
                                        <Nav.Link key={i} as={NavItem} disabled={i > this.getProgress()}
                                                  eventKey={i}>{isDesktop() ? value.title : i}</Nav.Link>
                                    );
                                })}
                            </Nav>

                            {(isDesktop()) ? (
                                <Button variant={"dark"} className={"mt-2"} onClick={this.nextStep} size={"sm"}>
                                    <FontAwesomeIcon icon={faCaretRight}/> Weiter
                                </Button>
                            ) : ""}
                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.steps.map((value) => {
                                    e++;
                                    return (
                                        <Tab.Pane key={"2" + e} eventKey={e}>
                                            <div className={"stepTitle"}>{value.title}</div>
                                            {value.callback.call(value.callback)}
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </>
        );
    }

    protected nextStep = () => {
        if (this.progress < this.steps.length) {
            this.currentStep++;
            this.progress = this.currentStep;
            this.refresh();
        } else {
            if (this.currentStep < this.steps.length) {
                this.currentStep++;
                this.refresh();
            }
        }
    }

    protected addStep = (callback: () => React.ReactElement, title?: string) => {
        let newIndex = this.steps.length + 1;
        let stepTitle = String(newIndex);

        if (title) {
            stepTitle = stepTitle + ": " + title;
        }

        let singleStep: SingleStep = {
            callback: callback,
            title: stepTitle
        };

        this.steps.push(singleStep);
    }

    protected getCurrentStep = (): number => {
        return this.currentStep;
    }

    protected getProgress = (): number => {
        return this.progress;
    }

    protected isLastStep = (): boolean => {
        return this.getProgress() === this.steps.length;
    }

    private changeCurrentTab = (title: string | null) => {
        if (title !== null) {
            let step: number = parseInt(title);

            if (step > this.progress) {
                this.progress = step;
            }

            this.currentStep = step;
            this.refresh();
        }
    }

    private refresh() {
        this.forceUpdate();
    }

}

export default StepComponent;
