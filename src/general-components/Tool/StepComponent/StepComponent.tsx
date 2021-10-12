import React, {Component, RefObject} from "react";
import {Accordion, Button, Card, Col, Fade, Modal, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {clearControlFooter, setControlFooterItem} from "../../ControlFooter/ControlFooter";
import {FormComponent} from "../FormComponent/FormComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight, faSave, faUndo} from "@fortawesome/free-solid-svg-icons/";
import {Tool} from "../Tool";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

import "./step-component.scss";
import "./step-component-desk.scss";


export interface StepProp<T> {
    id: string
    title: string
    form: JSX.Element
    values?: T
}

interface Step<T> extends StepProp<T> {
    ref: RefObject<FormComponent<any, any>>
}

export interface StepComponentProps {
    steps?: StepProp<any>[]
    tool?: Tool
    onSave?: (data: object, forms: Map<string, FormComponent<any, any>>) => Promise<boolean>
}

export interface StepComponentState {
    steps: Array<Step<any>>
    onReset: boolean
    showResetModal: boolean
    hasCustomNextButton: boolean
    customNextButton: {
        text: string
        callback: () => void
    } | null
}

class StepComponent extends Component<StepComponentProps, StepComponentState> {
    private currentStep: number = 1;
    private currentProgress: number = 1;

    constructor(props: any) {
        super(props);

        let steps: Array<Step<any>> = [];
        this.props.steps?.map((value) => {
            let ref = React.createRef<FormComponent<any, any>>();
            let form = React.cloneElement(value.form, {
                ref: ref,
                id: value.id,
                title: value.title,
                tool: this.props.tool,
                stepComp: this
            });

            steps.push({
                values: value.values,
                ref: ref,
                title: value.title,
                id: value.id,
                form: form
            });

            return null;
        });

        this.state = {
            steps: steps,
            onReset: false,
            showResetModal: false,
            hasCustomNextButton: false,
            customNextButton: null
        }
    }

    render = () => {
        let i = 0;
        let e = 0;

        if (this.props.steps?.length !== undefined && this.props.steps?.length < 1) {
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
                        {(!isDesktop() && this.props.tool !== undefined) ? (
                            <Accordion className={"stepHeaderAccordion"}>
                                <Accordion.Item eventKey={"description"}>
                                    <Accordion.Header>
                                        {this.props.tool?.getCurrentTool()?.name}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        {this.props.tool?.getCurrentTool()?.description}
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        ) : ""}

                        <Col className={"stepTabContainer"}>
                            {(isDesktop() && this.props.tool !== undefined) ? (
                                <>
                                    <div className={"stepHeader"}>
                                        {this.props.tool?.getCurrentTool()?.name}
                                    </div>
                                    <p>
                                        {this.props.tool?.getCurrentTool()?.description}
                                    </p>
                                </>
                            ) : ""}

                            <Nav className={"stepTabs"}>
                                {this.state.steps.map((value) => {
                                    i++;
                                    return (
                                        <Nav.Link key={i} as={NavItem} disabled={i > this.currentProgress}
                                                  eventKey={i}>{isDesktop() ? value.title : i}</Nav.Link>
                                    );
                                })}
                            </Nav>

                            {(isDesktop()) && (
                                <>
                                    {(!this.state.hasCustomNextButton) ? (
                                        <Button
                                            variant={"dark"}
                                            type={"submit"}
                                            form={this.state.steps[this.currentStep - 1].id} className={"mt-2"}
                                            key={"saveOrNextButton"}
                                        >
                                            <FontAwesomeIcon
                                                icon={this.isLastStep() ? faSave : faCaretRight}/> {this.isLastStep() ? "Speichern" : "Weiter"}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={"dark"}
                                            type={"button"}
                                            onClick={this.state.customNextButton?.callback}
                                            className={"mt-2"}
                                            key={"customNextButton"}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCaretRight}/> {this.state.customNextButton?.text}
                                        </Button>
                                    )}
                                    <Button
                                        variant={"dark"}
                                        type={"button"}
                                        className={"mt-2 mx-2"}
                                        onClick={() => this.setState({onReset: true, showResetModal: true})}
                                        key={"resetButton"}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUndo}/> Zurücksetzen
                                    </Button>
                                </>
                            )}
                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.state.steps.map((value) => {
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
                                Ja, ab diesem Schritt neu beginnen!
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </>
        );
    }

    componentDidMount = async () => {
        if ((this.props.steps?.length !== undefined && this.props.steps?.length > 1)) {
            this.restoreFooter();
        } else {
            setControlFooterItem(2, {home: true});
        }

        let progress = 0;
        this.state.steps?.map((step) => {
            if (step.values && Object.keys(step.values).length !== 0) {
                progress++;
                step.ref.current?.setValues(step.values);
                step.ref.current?.setDisabled(true);
                step.ref.current?.rebuildValues(step.values);
                step.ref.current?.forceUpdate();
            }
            return null;
        });
        if (progress > 0) {
            this.currentProgress = progress;
        }
    }

    componentWillUnmount() {
        clearControlFooter();
    }

    public getPreviousStep = <D extends unknown>(): null | D => {
        if (this.currentStep <= 1) {
            return null;
        }
        let previousStep = this.state.steps[this.currentStep - 2];
        return (previousStep.ref.current?.getValues() as D);
    }

    public getFormValues<D>(indexOrID: number | string) {
        let step;
        if (typeof indexOrID === "number") {
            if (indexOrID < 1 || indexOrID > this.state.steps.length) {
                return null;
            }
            step = this.state.steps[indexOrID];
        } else {
            for (const stepValue of this.state.steps) {
                if (stepValue.id === indexOrID) {
                    step = stepValue;
                    break;
                }
            }
        }
        if (step) {
            return (step?.ref.current?.getValues() as D);
        }
        return null;
    }

    public isAt = (currentStep: number): boolean => {
        return this.currentStep === currentStep;
    }

    public isFirstStep = (): boolean => {
        return this.currentStep <= 1;
    }

    public isLastStep = (): boolean => {
        return this.currentStep >= this.state.steps.length;
    }

    public nextStep = async () => {
        this.restoreFooter();

        let step;
        if (this.currentProgress < this.state.steps.length && this.currentStep >= this.currentProgress) {
            step = this.state.steps[this.currentProgress - 1].ref;
            step.current?.setDisabled(true);

            this.currentStep++;
            this.currentProgress = this.currentStep;

            step = this.state.steps[this.currentProgress - 1].ref;
            await step.current?.buildPreviousValues();
            step.current?.forceUpdate();

            await this.onSave();
            await this.props.tool?.lock();
        } else {
            if (this.currentStep < this.state.steps.length) {
                this.currentStep++;

                step = this.state.steps[this.currentStep - 1].ref;
                await step.current?.buildPreviousValues();
                step.current?.forceUpdate();
            }
        }

        if (this.isLastStep()) {
            this.restoreFooter();
        }

        step = this.state.steps[this.currentProgress - 1].ref;
        if (!step.current?.isDisabled()) {
            step.current?.changeControlFooter();
        }

        this.forceUpdate();
    }

    public onSave = async (): Promise<boolean> => {
        if (this.props.onSave !== undefined) {
            let allForms = new Map<string, FormComponent<any, any>>();
            let data = {};

            for (const {ref, id} of this.state.steps) {
                Object.assign(data, {[id]: ref.current?.getValues()});
                // ref.current?.setDisabled(true);
                allForms.set(ref.current?.props.id as string, ref.current as FormComponent<any, any>);
            }

            return await this.props.onSave(data, allForms);
        }
        return false;
    }

    public addCustomNextButton = (text: string, callback: () => any) => {
        let button = {text: text, callback: callback, icon: faCaretRight};

        this.setState({
            hasCustomNextButton: true,
            customNextButton: button
        });

        setControlFooterItem(3, {button: button});
    }

    public addCustomPreviousButton = (text: string, callback: () => any) => {
        setControlFooterItem(1, {button: {text: text, callback: callback, icon: faCaretLeft}});
    }

    public restoreFooter = () => {
        setControlFooterItem(1, {
            tool: {
                icon: this.props.tool?.getToolIcon() as IconDefinition,
                title: this.props.tool?.getToolName() as string,
                link: this.props.tool?.getLink() as string
            }
        });
        setControlFooterItem(2, {
            reset: () => {
                this.setState({
                    onReset: true,
                    showResetModal: true
                })
            }
        });

        let id = this.state.steps[this.currentStep - 1].id;

        if (this.isLastStep()) {
            setControlFooterItem(3, {saveSteps: id});
        } else {
            setControlFooterItem(3, {nextStep: id});
        }

        this.setState({
            hasCustomNextButton: false,
            customNextButton: null
        });
    }

    private resetSteps(currentStep?: number) {
        let i = (currentStep !== undefined) ? currentStep : 0;

        if (currentStep !== undefined) {
            this.currentStep = currentStep;
            this.currentProgress = currentStep;

            let form = this.state.steps[currentStep - 1].ref.current;
            form?.reset({same: true, all: false});
        } else {
            this.currentStep = 1;
            this.currentProgress = 1;
        }

        for (i; i < this.state.steps.length; i++) {
            let step = this.state.steps[i].ref;
            step.current?.reset({same: false, all: true});
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
            this.restoreFooter();

            let step = this.state.steps[newProgress - 1].ref;
            if (!step.current?.isDisabled()) {
                step.current?.changeControlFooter();
            }

            this.forceUpdate();
        }
    }
}

export default StepComponent;
