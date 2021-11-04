import React, {Component, ReactComponentElement, ReactNode, RefObject} from "react";
import {Accordion, Button, Col, Collapse, Fade, Form, Modal, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../../../Desktop";
import {clearControlFooter, disableControlFooterItem, setControlFooterItem} from "../../../ControlFooter/ControlFooter";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight, faSave, faSyncAlt, faUndo} from "@fortawesome/free-solid-svg-icons/";
import {Tool} from "../../Tool";
import "./step-component.scss";
import "./step-component-desk.scss";
import {Messages} from "../../../Messages/Messages";
import {Loader} from "../../../Loader/Loader";
import {Step} from "./Step/Step";
import {StepComponentHeader} from "./StepComponentHeader/StepComponentHeaderProp";
import {LoadingButton} from "../../../LoadingButton/LoadingButton";


export interface StepProp<T> {
    id: string
    title: string
    form: JSX.Element
    values?: T
}
// TODO: vielleicht besseren namen überlegen
interface InternalStep<T> extends StepProp<T> {
    ref: RefObject<Step<any, any>>
}

export interface StepComponentProps {
    steps: StepProp<any>[]
    tool: Tool
    matrix?: ReactComponentElement<any>
    onSave: (data: object, forms: Map<string, Step<any, any>>) => Promise<boolean>
}

export interface StepComponentState {
    steps: Array<InternalStep<any>>
    onReset: boolean
    showResetModal: boolean
    hasCustomNextButton: boolean
    customNextButton: {
        text: string
        callback: () => void
    } | null
    isSaving: boolean
}

class StepComponent extends Component<StepComponentProps, StepComponentState> {
    private currentStep: number = 1;
    private currentProgress: number = 1;

    constructor(props: any) {
        super(props);

        let steps: Array<InternalStep<any>> = [];
        this.props.steps.map((value) => {
            let ref = React.createRef<Step<any, any>>();
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
            customNextButton: null,
            isSaving: false
        }
    }

    render = () => {
        let i = 0;
        let e = 0;

        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.currentStep}
                    transition={Fade}
                    onSelect={(e) => this.onStepSelect(e)}
                >
                    <Row className={"stepContainer"}>
                        {(!isDesktop()) && (
                            <StepComponentHeader tool={this.props.tool}/>
                        )}

                        <Col className={"stepTabContainer"}>
                            {(isDesktop() ) && (
                                <StepComponentHeader tool={this.props.tool}/>
                            )}

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
                                            form={this.state.steps[this.currentStep - 1].id}
                                            disabled={this.isLastStep()}
                                            className={"mt-2 mx-2"}
                                            key={"nextButton"}
                                        >
                                            <FontAwesomeIcon icon={faCaretRight}/> Weiter
                                        </Button>
                                    ) : (
                                        <Button
                                            variant={"dark"}
                                            type={"button"}
                                            onClick={this.state.customNextButton?.callback}
                                            disabled={this.isLastStep()}
                                            className={"mt-2 mx-2"}
                                            key={"customNextButton"}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCaretRight}/> {this.state.customNextButton?.text}
                                        </Button>
                                    )}
                                    <Button
                                        variant={"dark"}
                                        type={"button"}
                                        className={"mt-2"}
                                        onClick={() => this.setState({onReset: true, showResetModal: true})}
                                        key={"resetButton"}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUndo}/> Zurücksetzen
                                    </Button>

                                    <br/>

                                    <LoadingButton
                                        variant={"dark"}
                                        type={"button"}
                                        onClick={async () => {
                                            await this.save();
                                        }}
                                        className={"mt-2"}
                                        key={"saveButton"}
                                        isSaving={this.state.isSaving}
                                        savingChild={"Speichern"}
                                        defaultChild={"Speichern"}
                                    />
                                </>
                            )}

                            {this.shouldMatrixRender() && (
                                this.getMatrix()
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
                step.ref.current?.rebuildValues(step.values);

                if (
                    progress < this.state.steps.length
                    && Object.keys(this.state.steps[progress].values).length > 0
                ) {
                    step.ref.current?.setDisabled(true);
                }

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

    public getCurrentStep = () => {
        return this.currentStep;
    }

    public getCurrentProgress = () => {
        return this.currentProgress;
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
        let isProgress: boolean = false;
        if (this.currentProgress < this.state.steps.length && this.currentStep >= this.currentProgress) {
            step = this.state.steps[this.currentProgress - 1].ref;
            step.current?.setDisabled(true);

            this.currentStep++;
            this.currentProgress = this.currentStep;

            step = this.state.steps[this.currentProgress - 1].ref;
            await step.current?.buildPreviousValues();
            step.current?.forceUpdate();

            isProgress = true;
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

        if (isProgress) {
            await this.save();
        }

        this.forceUpdate();
    }

    public save = async () => {
        this.setState({
            isSaving: true
        });
        disableControlFooterItem(2, true);

        this.triggerFormSubmits(this.currentProgress, true);

        const addErrorMessage = () => {
            Messages.add(
                "Speichern fehlgeschlagen! Bitte versuchen Sie es später erneut.",
                "DANGER",
                Messages.TIMER
            );
        }

        let lockCall = await this.props.tool?.lock();
        if (lockCall && lockCall.success) {
            let saveCall = await this.callOnSaveProp();
            if (saveCall) {
                Messages.add(
                    "Erfolgreich abgespeichert!",
                    "SUCCESS",
                    Messages.TIMER
                );
            } else {
                addErrorMessage();
            }
        } else {
            addErrorMessage();
        }

        disableControlFooterItem(2, false);
        this.setState({
            isSaving: false
        });
    }

    public callOnSaveProp = async (): Promise<boolean> => {
        if (this.props.onSave !== undefined) {
            let allForms = this.getAllForms();
            let data = this.getAllData();

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
            reset: () => {
                this.setState({
                    onReset: true,
                    showResetModal: true
                })
            }
        });

        let id = this.state.steps[this.currentStep - 1].id;

        setControlFooterItem(3, {
            nextStep: id
        });
        disableControlFooterItem(3, this.isLastStep());

        setControlFooterItem(2, {
            button: {
                callback: async () => {
                    await this.save();
                },
                text: "Speichern",
                icon: faSave
            }
        });

        this.setState({
            hasCustomNextButton: false,
            customNextButton: null
        });
    }

    public getAllData = (): object => {
        let data = {};
        for (const {ref, id} of this.state.steps) {
            Object.assign(data, {[id]: ref.current?.getValues()});
        }
        return data;
    }

    public getAllForms = (): Map<string, Step<any, any>> => {
        let forms = new Map<string, Step<any, any>>();
        for (const {ref, id} of this.state.steps) {
            forms.set(id, ref.current as Step<any, any>);
        }
        return forms;
    }

    private triggerFormSubmits(to: number, saving: boolean) {
        for (let i = 0; i < to; i++) {
            let {ref: {current}} = this.state.steps[i];
            current?.setIsSaving(saving);
            current?.triggerFormSubmit();
        }
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

        this.restoreFooter();
        this.state.steps[(currentStep !== undefined) ? (currentStep - 1) : 0].ref.current?.changeControlFooter();
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

    private getMatrix(): undefined | ReactNode {
        if (this.props.matrix === undefined) return null;

        this.triggerFormSubmits(this.currentProgress, true);
        let data = this.getAllData();

        let matrix = React.cloneElement(this.props.matrix, {
            tool: this.props.tool,
            stepComponent: this,
            data: data
        });

        const getMatrixContainer = () => {
            return (
                <div className={"matrixContainer"}>
                    <div className={"matrix"}>
                        {matrix}
                    </div>
                    <div className={"matrixButtons"}>
                        <Button
                            type={"button"}
                            variant={"dark"}
                            onClick={() => {
                                this.refreshMatrix();
                            }}
                        >
                            <FontAwesomeIcon icon={faSyncAlt}/> Matrix aktualisieren
                        </Button>
                    </div>
                </div>
            );
        }

        if (isDesktop()) {
            return getMatrixContainer();
        } else {
            return (
                <Accordion onSelect={() => {
                    this.refreshMatrix();
                }} className={"matrixAccordion"}>
                    <Accordion.Item eventKey={"matrix"}>
                        <Accordion.Header>
                            Matrix
                        </Accordion.Header>
                        <Accordion.Body>
                            {getMatrixContainer()}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            );
        }
    }

    private refreshMatrix() {
        this.forceUpdate();
    }

    private shouldMatrixRender(): boolean {
        if (this.props.matrix !== undefined) {
            for (const n of this.props.matrix.props.steps) {
                if (n === this.currentStep) {
                    return true;
                }
            }
        }
        return false;
    }

}

export default StepComponent;
