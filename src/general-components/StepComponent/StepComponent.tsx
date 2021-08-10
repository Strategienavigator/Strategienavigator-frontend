import React, {Component, RefObject} from "react";

import "./step-component.scss";
import "./step-component-desk.scss";
import {Button, Card, Col, Fade, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../Desktop";
import FixedFooter, {FooterToolProps} from "../FixedFooter/FixedFooter";
import FormComponent from "../Form/FormComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faSave} from "@fortawesome/free-solid-svg-icons/";

export type StepProp = {
    id: string,
    title: string,
    form: JSX.Element,
    ref?: React.Ref<any>
};

interface StepComponentProps {
    steps: StepProp[]
    header?: string
    fixedFooterToolProp?: FooterToolProps
    onSave?: (forms: Array<FormComponent<any, any>>) => Promise<boolean>
}


class StepComponent extends Component<StepComponentProps, any> {
    private allSteps: Array<StepProp> = new Array<StepProp>();
    private currentStep: number = 1;
    private currentProgress: number = 1;

    private readonly completedSteps: Array<RefObject<FormComponent<any, any>>>;
    private readonly allRefs: Array<RefObject<FormComponent<any, any>>> = new Array<RefObject<FormComponent<any, any>>>();

    constructor(props: any) {
        super(props);

        this.completedSteps = new Array<RefObject<FormComponent<any, any>>>();
        this.allRefs = new Array<RefObject<FormComponent<any, any>>>();

        this.props.steps.map((value) => {
            let ref = React.createRef<FormComponent<any, any>>();
            this.allRefs.push(ref);

            value.form = React.cloneElement(value.form, {ref: ref, id: value.id, title: value.title, stepComp: this});
            this.allSteps.push(value);

            return null;
        });
    }

    render = () => {
        let i = 0;
        let e = 0;

        if (this.props.steps.length < 1) {
            return (
                <Card body>
                    Diese Analyse ist in Bearbeitung...
                </Card>
            );
        }

        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.currentStep}
                    transition={Fade}
                    onSelect={(e) => this.onStepSelect(e)}
                >
                    <Row className={"stepContainer"}>
                        <Col className={"stepTabContainer"}>

                            {(isDesktop() && this.props.header !== undefined) ? (
                                <div className={"stepHeader"}>{this.props.header}</div>
                            ) : ""}

                            <Nav className={"stepTabs"}>
                                {this.props.steps.map((value) => {
                                    i++;
                                    return (
                                        <Nav.Link key={i} as={NavItem} disabled={i > this.currentProgress}
                                                  eventKey={i}>{isDesktop() ? value.title : i}</Nav.Link>
                                    );
                                })}
                            </Nav>

                            {(isDesktop()) ? (
                                <Button variant={"dark"} type={"submit"}
                                        form={this.allSteps[this.currentStep - 1].id} className={"mt-2"}
                                >
                                    <FontAwesomeIcon
                                        icon={this.isLastStep() ? faSave : faCaretRight}/> {this.isLastStep() ? "Speichern" : "Weiter"}
                                </Button>
                            ) : ""}

                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.allSteps.map((value) => {
                                    e++;

                                    return (
                                        <Tab.Pane key={"2" + e} eventKey={e}>
                                            <div className={"stepTitle"}>{value.title}</div>
                                            {value.form}
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

                {(!isDesktop() && this.isLastStep()) && (
                    <FixedFooter
                        tool={this.props.fixedFooterToolProp}
                        saveTool={this.allSteps[this.currentStep - 1].id}
                    />
                )}

                {(!isDesktop() && !this.isLastStep()) && (
                    <FixedFooter
                        tool={this.props.fixedFooterToolProp}
                        nextStep={this.allSteps[this.currentStep - 1].id}
                    />
                )}
            </>
        );
    }

    public getPreviousStep = (): null | FormComponent<any, any> => {
        if ((this.currentStep - 1 <= this.completedSteps.length) && this.completedSteps.length !== 0) {
            return this.completedSteps[this.currentStep - 2].current;
        }
        return null;
    }

    public getForm = (index: number) => {
        if (index <= this.completedSteps.length) {
            return this.completedSteps[index].current?.getValues();
        }
        return null;
    }

    public isAt = (index: number): boolean => {
        return this.currentStep === index;
    }

    public isFirstStep = (): boolean => {
        return this.currentStep === 1;
    }

    public isLastStep = (): boolean => {
        return this.currentStep === this.allSteps.length;
    }

    public nextStep = () => {
        if (this.currentProgress < this.allSteps.length) {
            let step = this.allRefs[this.currentProgress - 1];
            this.completedSteps.push(step);
            step.current?.setDisabled(true);

            this.currentStep++;
            this.currentProgress = this.currentStep;

            step = this.allRefs[this.currentProgress - 1];
            step.current?.prepareValues();
            step.current?.forceUpdate();

            this.forceUpdate();
        } else {
            if (this.currentStep < this.allSteps.length) {
                this.currentStep++;

                let step = this.allRefs[this.currentStep - 1];
                step.current?.prepareValues();
                step.current?.forceUpdate();

                this.forceUpdate();
            }
        }
    }

    public onSave = async (): Promise<boolean> => {
        if (this.props.onSave !== undefined) {
            let allForms = new Array<FormComponent<any, any>>();

            for (const form of this.allRefs) {
                allForms.push(form.current as FormComponent<any, any>);
            }

            return await this.props.onSave(allForms);
        }
        return false;
    }

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let step: number = parseInt(title);

            if (step > this.currentProgress) {
                this.currentProgress = step;
            }

            this.currentStep = step;
            this.forceUpdate();
        }
    }
}

export default StepComponent;
