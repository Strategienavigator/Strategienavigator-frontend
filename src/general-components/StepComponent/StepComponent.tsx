import React, {Component} from "react";
import {Button, Col, Nav, NavItem, Row, Tab} from "react-bootstrap";

import "./step-component.scss";
import "./step-component-desk.scss";
import {isDesktop} from "../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons/faCaretRight";
import FixedFooter, {FooterToolProps} from "../FixedFooter/FixedFooter";
import Form from "../Form/Form";
import {faSave} from "@fortawesome/free-solid-svg-icons/";

export interface SingleStep {
    form: Form<any>
    title: string
}

abstract class StepComponent<P, S> extends Component<P, S> {

    protected steps: Array<SingleStep> = [];
    protected currentStep: number = 1;
    protected progress: number = 1;
    protected completedSteps: Array<SingleStep> = [];

    private readonly header: string;
    private readonly fixedFooterProps: FooterToolProps;

    protected constructor(props: any, header: string, fixedFooterProps: FooterToolProps) {
        super(props);
        this.header = header;
        this.fixedFooterProps = fixedFooterProps;
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
                                <Button variant={"dark"} type={"submit"}
                                        form={this.steps[this.currentStep - 1].form.getID()} className={"mt-2"}
                                        size={"sm"}>
                                    <FontAwesomeIcon
                                        icon={this.isLastStep() ? faSave : faCaretRight}/> {this.isLastStep() ? "Speichern" : "Weiter"}
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
                                            {value.form.render()}
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

                {(!isDesktop() && !this.isLastStep()) && (
                    <FixedFooter
                        tool={this.fixedFooterProps}
                        nextStep={this.steps[this.currentStep - 1].form.getID()}
                    />
                )}
                {(!isDesktop() && this.isLastStep()) && (
                    <FixedFooter
                        tool={this.fixedFooterProps}
                        saveTool={this.steps[this.currentStep - 1].form.getID()}
                    />
                )}
            </>
        );
    }

    public nextStep = () => {
        if (this.progress < this.steps.length) {
            let step = this.steps[this.progress - 1];
            this.completedSteps.push(step);

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

    public getSteps = (): Array<SingleStep> => {
        return this.steps;
    }

    public abstract save(forms: Array<SingleStep>): any;

    public isLastStep = (): boolean => {
        return this.currentStep === this.steps.length;
    }

    public getCompletedStep(className: string): Form<any> | null {
        for (const step of this.completedSteps) {
            if (step.form.constructor.name === className) {
                return step.form;
            }
        }
        return null;
    }

    protected addStep = (content: Form<any>, title?: string) => {
        let newIndex = this.steps.length + 1;
        let stepTitle = String(newIndex);

        if (title) {
            stepTitle = stepTitle + ": " + title;
        }

        let singleStep: SingleStep = {
            title: stepTitle,
            form: content
        };

        this.steps.push(singleStep);
    }

    protected getCurrentStep = (): number => {
        return this.currentStep;
    }

    protected getProgress = (): number => {
        return this.progress;
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
