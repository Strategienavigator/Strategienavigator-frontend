import React, {Component, RefObject} from "react";

import "./step-component.scss";
import "./step-component-desk.scss";
import {Button, Card, Col, Fade, Modal, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../Desktop";
import {clearControlFooter, setControlFooterItem, ToolItem} from "../ControlFooter/ControlFooter";
import FormComponent from "../Form/FormComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faSave, faUndo} from "@fortawesome/free-solid-svg-icons/";

export type StepProp = {
    id: string,
    title: string,
    form: JSX.Element,
    ref?: React.Ref<any>
};

interface StepComponentProps {
    steps: StepProp[]
    header?: string
    controlFooterTool: ToolItem
    onSave?: (forms: Array<FormComponent<any, any>>) => Promise<boolean>
    maintenance?: boolean
}

interface StepComponentState {
    onReset: boolean
    showResetModal: boolean
}

class StepComponent extends Component<StepComponentProps, StepComponentState> {
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

        this.state = {
            onReset: false,
            showResetModal: false
        }
    }

    render = () => {
        let i = 0;
        let e = 0;

        if (this.props.steps.length < 1 || this.props.maintenance) {
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

                            {(isDesktop()) && (
                                <>
                                    <Button
                                        variant={"dark"}
                                        type={"submit"}
                                        form={this.allSteps[this.currentStep - 1].id} className={"mt-2"}
                                    >
                                        <FontAwesomeIcon
                                            icon={this.isLastStep() ? faSave : faCaretRight}/> {this.isLastStep() ? "Speichern" : "Weiter"}
                                    </Button>
                                    <Button
                                        variant={"dark"}
                                        type={"button"}
                                        className={"mt-2 mx-2"}
                                        onClick={() => this.setState({onReset: true, showResetModal: true})}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUndo}/> Zurücksetzen
                                    </Button>
                                </>
                            )}
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

                {(this.state.onReset) && (
                    <Modal
                        show={this.state.showResetModal}
                        backdrop="static"
                        keyboard={true}
                    >
                        <Modal.Header>
                            <Modal.Title>Sind Sie sich sicher?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Sind Sie sich sicher, dass Sie mit dem zurücksetzen fortfahren möchten?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => this.setState({showResetModal: false, onReset: false})}
                                variant={"light"}
                            >
                                Nein!
                            </Button>
                            <Button
                                variant="dark"
                                onClick={() => {
                                    this.setState({showResetModal: false, onReset: false});
                                    this.resetSteps();
                                }}
                            >
                                Ja, ALLE Schritte zurücksetzen!
                            </Button>
                            <Button
                                variant="dark"
                                onClick={() => {
                                    this.setState({showResetModal: false, onReset: false});
                                    this.resetSteps(this.currentStep);
                                }}
                            >
                                Ja, ab dem aktuellen Schritt neu beginnen!
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </>
        );
    }

    componentDidMount = async () => {
        if (this.props.steps.length > 1 && !this.props.maintenance) {
            this.setFooter();
        } else {
            setControlFooterItem(2, {home: true});
        }
    }

    componentWillUnmount() {
        clearControlFooter();
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

    public isAt = (currentStep: number): boolean => {
        return this.currentStep === currentStep;
    }

    public isFirstStep = (): boolean => {
        return this.currentStep === 1;
    }

    public isLastStep = (): boolean => {
        return this.currentStep === this.allSteps.length;
    }

    public nextStep = async () => {
        this.setFooter();

        let step;
        if (this.currentProgress < this.allSteps.length && this.currentStep >= this.currentProgress) {
            step = this.allRefs[this.currentProgress - 1];
            this.completedSteps.push(step);
            step.current?.setDisabled(true);

            this.currentStep++;
            this.currentProgress = this.currentStep;

            step = this.allRefs[this.currentProgress - 1];
            await step.current?.prepareValues();
            step.current?.forceUpdate();
        } else {
            if (this.currentStep < this.allSteps.length) {
                this.currentStep++;

                step = this.allRefs[this.currentStep - 1];
                await step.current?.prepareValues();
                step.current?.forceUpdate();
            }
        }

        step = this.allRefs[this.currentProgress - 1];
        if (!step.current?.isDisabled()) {
            step.current?.changeControlFooter();
        }

        this.forceUpdate();
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

    public setFooter = () => {
        setControlFooterItem(1, this.props.controlFooterTool);
        setControlFooterItem(2, {
            reset: () => {
                this.setState({
                    onReset: true,
                    showResetModal: true
                })
            }
        });

        let id = this.allSteps[this.currentStep - 1].id;

        if (this.isLastStep()) {
            setControlFooterItem(3, {saveSteps: id});
        } else {
            setControlFooterItem(3, {nextStep: id});
        }
    }

    private resetSteps(currentStep?: number) {
        let i = (currentStep !== undefined) ? (currentStep) : 0;

        if (currentStep !== undefined) {
            this.currentStep = currentStep;
            this.currentProgress = currentStep;

            this.allRefs[currentStep - 1].current?.setDisabled(false);
        } else {
            this.currentStep = 1;
            this.currentProgress = 1;
        }

        for (i; i < this.allSteps.length; i++) {
            let step = this.allRefs[i];
            step.current?.reset();
        }

        this.forceUpdate();
    }

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let newProgress: number = parseInt(title);

            if (newProgress > this.currentProgress) {
                this.currentProgress = newProgress;
            }

            this.currentStep = newProgress;
            this.setFooter();

            let step = this.allRefs[newProgress - 1];
            if (!step.current?.isDisabled()) {
                step.current?.changeControlFooter();
            }

            this.forceUpdate();
        }
    }
}

export default StepComponent;
