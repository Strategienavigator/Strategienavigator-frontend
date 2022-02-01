import React, {
    Component, ComponentClass,
    FunctionComponent,
    ReactComponentElement,
    ReactNode,
} from "react";
import {Accordion, Button, Col, Fade, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../../../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretLeft, faCaretRight, faSave, faSyncAlt} from "@fortawesome/free-solid-svg-icons/";
import {Tool} from "../../Tool";
import "./step-component.scss";
import "./step-component-desk.scss";
import {Messages} from "../../../Messages/Messages";
import {Step, SteppableProp} from "./Step/Step";
import {StepComponentHeader} from "./StepComponentHeader/StepComponentHeaderProp";
import {FooterContext} from "../../../Contexts/FooterContextComponent";
import {DesktopButtons} from "./DesktopButtons/DesktopButtons";
import {ResetStepsModal} from "./ResetStepsModal/ResetStepsModal";
import {faFileExport} from "@fortawesome/free-solid-svg-icons";
import {ExportModal} from "../../ExportButton";
import {ToolSavePage, ToolSaveProps} from "../../ToolSavePage/ToolSavePage";


export interface StepProp<T> {
    id: string
    title: string
    form: FunctionComponent<SteppableProp<T>> | ComponentClass<SteppableProp<T>>
}

export interface StepComponentProps<D> extends ToolSaveProps<D> {
    steps: StepProp<D>[]
    tool: Tool<D>,
    savePage: ToolSavePage<D>
    matrix?: ReactComponentElement<any>
}

export type CustomNextButton = {
    text: string
    callback: () => void
} | null;

export interface StepComponentState<T> {
    /**
     * Aktuell sichtbarer Schritt
     */
    currentStep: number;
    /**
     * maximal freigeschalteter Schritt
     */
    currentProgress: number;
    showResetModal: boolean
    showExportModal: boolean
    hasCustomNextButton: boolean
    customNextButton: CustomNextButton
    isSaving: boolean
}

class StepComponent<D> extends Component<StepComponentProps<D>, StepComponentState<D>> {


    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>


    constructor(props: StepComponentProps<D>, context: any) {
        super(props, context);

        let progress = 0;
        this.props.steps.forEach((step) => {
            if (step.values && Object.keys(step.values).length !== 0) {
                progress++;

                let value = step.fromValues(this.props.save.data);
                if (
                    progress < this.props.steps.length &&
                    Object.keys(value).length > 0
                ) {
                    progress++;
                }
            }
        });

        this.state = {
            currentProgress: progress,
            currentStep: 0,
            showExportModal: false,
            showResetModal: false,
            isSaving: false,
            hasCustomNextButton: false,
            customNextButton: null,
        }
    }

    render = () => {
        let i = 0;
        let e = 0;

        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.state.currentStep}
                    transition={Fade}
                    onSelect={(e) => this.onStepSelect(e)}
                >
                    <Row className={"stepContainer"}>
                        {(!isDesktop()) && (
                            <StepComponentHeader tool={this.props.tool}/>
                        )}

                        <Col className={"stepTabContainer"}>
                            {(isDesktop()) && (
                                <StepComponentHeader tool={this.props.tool}/>
                            )}

                            <Nav className={"stepTabs"}>
                                {this.props.steps.map((value) => {
                                    i++;
                                    return (
                                        <Nav.Link key={i} as={NavItem} disabled={i > this.state.currentProgress}
                                                  eventKey={i}>{isDesktop() ? value.title : i}</Nav.Link>
                                    );
                                })}
                            </Nav>

                            {(isDesktop()) && (
                                <DesktopButtons
                                    tool={this.props.tool}
                                    hasCustomNextButton={this.state.hasCustomNextButton}
                                    customNextButton={this.state.customNextButton}
                                    formID={this.props.steps[this.state.currentStep - 1].id}
                                    nextDisabled={this.isLastStep()}
                                    isSaving={this.state.isSaving}
                                    onReset={() => {
                                        this.setState({showResetModal: true})
                                    }}
                                    onSave={async () => {
                                        await this.save();
                                    }}
                                    onExportClick={() => {
                                        this.setState({
                                            showExportModal: true
                                        });
                                    }}
                                />
                            )}

                            {this.shouldMatrixRender() && (
                                this.getMatrix()
                            )}
                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.props.steps.map((value, index) => {
                                    e++;

                                    return (
                                        <Tab.Pane key={"2" + e} eventKey={e}>
                                            <div className={"stepTitle"}>{value.title}</div>

                                            {React.createElement(value.form, {
                                                id: value.id,
                                                title: value.title,
                                                stepComp: this,
                                                disabled: this.state.currentProgress > index
                                            })}
                                        </Tab.Pane>
                                    );
                                })}
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>

                <ResetStepsModal
                    show={this.state.showResetModal}
                    onYes={() => {
                        this.setState({showResetModal: false});
                        this.resetSteps(this.state.currentStep);
                    }}
                    onAllReset={() => {
                        this.setState({showResetModal: false});
                        this.resetSteps();
                    }}
                    onNo={() => {
                        this.setState({showResetModal: false})
                    }}
                />

                <ExportModal
                    onClose={() => {
                        this.setState({
                            showExportModal: false
                        });
                    }}
                    onSelect={(exporter) => {
                        let save = this.props.save;
                        this.triggerFormSubmits(this.state.currentProgress, true);
                        let data = this.getAllData();

                        if (save) {
                            save.data = data;
                            exporter.export(save);
                        } else {
                            Messages.add("Keine Daten vorhanden!", "DANGER", Messages.TIMER);
                        }

                        this.setState({
                            showExportModal: false
                        });
                    }}
                    show={this.state.showExportModal}
                    tool={this.props.tool}
                />
            </>
        );
    }

    componentDidMount = async () => {
        if ((this.props.steps !== undefined && this.props.steps.length > 1)) {
            this.restoreFooter();
        } else {
            this.context.setItem(2, {home: true});
        }


    }

    componentWillUnmount() {
        this.context.clearItems();
    }

    private getCurrentStep = () => {
        return this.state.currentStep;
    }

    private getCurrentProgress = () => {
        return this.state.currentProgress;
    }

    public getPreviousStep = <D extends unknown>(): null | D => {
        if (this.state.currentStep <= 1) {
            return null;
        }
        let previousStep = this.props.steps[this.state.currentStep - 2];
        return previousStep.fromValues(this.props.save.data);
    }

    public getFormValues(indexOrID: number | string) {
        let step;
        if (typeof indexOrID === "number") {
            if (indexOrID < 1 || indexOrID > this.props.steps.length) {
                return null;
            }
            step = this.props.steps[indexOrID];
        } else {
            for (const stepValue of this.props.steps) {
                if (stepValue.id === indexOrID) {
                    step = stepValue;
                    break;
                }
            }
        }
        if (step !== undefined) {
            return step.fromValues(this.props.save.data);
        }
        return null;
    }

    public isAt = (currentStep: number): boolean => {
        return this.state.currentStep === currentStep;
    }

    public isFirstStep = (): boolean => {
        return this.state.currentStep <= 1;
    }

    public isLastStep = (): boolean => {
        return this.state.currentStep >= this.props.steps.length;
    }

    public nextStep = async () => {
        this.restoreFooter();


        let isProgress: boolean = false;
        let newProgress = this.state.currentProgress;
        let newStep = this.state.currentStep;
        if (this.state.currentProgress < this.props.steps.length && this.state.currentStep >= this.state.currentProgress) {
            newStep++;
            newProgress = this.state.currentStep;

            isProgress = true;
        } else if (this.state.currentStep < this.props.steps.length) {
            newStep++;
        }

        this.setState({
            currentProgress: newProgress,
            currentStep: newStep
        });

        if (this.isLastStep()) {
            this.restoreFooter();
        }

        // TODO step control footer

        if (isProgress) {
            await this.save();
        }

        this.forceUpdate();
    }

    public save = async () => {
        this.setState({
            isSaving: true
        });
        this.context.disableItem(3, true);

        this.triggerFormSubmits(this.state.currentProgress, true);

        const addErrorMessage = () => {
            Messages.add(
                "Speichern fehlgeschlagen! Bitte versuchen Sie es später erneut.",
                "DANGER",
                Messages.TIMER
            );
        }


        let saveCall = await this.props.saveController.save();
        if (saveCall) {
            Messages.add(
                "Erfolgreich abgespeichert!",
                "SUCCESS",
                Messages.TIMER
            );
        } else {
            addErrorMessage();
        }

        this.context.disableItem(3, false);
        this.setState({
            isSaving: false
        });
    }

    public addCustomNextButton = (text: string, callback: () => any) => {
        let button = {text: text, callback: callback, icon: faCaretRight};

        this.setState({
            hasCustomNextButton: true,
            customNextButton: button
        });

        this.context.setItem(3, {button: button});
    }

    public addCustomPreviousButton = (text: string, callback: () => any) => {
        this.context.setItem(1, {button: {text: text, callback: callback, icon: faCaretLeft}});
    }

    public restoreFooter = () => {
        this.context.setItem(1, {
            reset: () => {
                this.setState({
                    showResetModal: true
                })
            }
        });

        let id = this.props.steps[this.state.currentStep - 1].id;

        this.context.setItem(2, {
            button: {
                text: "Exportieren",
                icon: faFileExport,
                callback: () => {
                    this.setState({
                        showExportModal: true
                    });
                }
            }
        });

        this.context.setItem(3, {
            button: {
                callback: async () => {
                    await this.save();
                },
                text: "Speichern",
                icon: faSave
            }
        });

        this.context.setItem(4, {
            nextStep: id
        });
        this.context.disableItem(4, this.isLastStep());

        this.setState({
            hasCustomNextButton: false,
            customNextButton: null
        });
    }

    public getAllData = (): D => {
        let data = {} as D;
        for (const {ref, id} of this.props.steps) {
            Object.assign(data, {[id]: step});
        }
        return data;
    }

    public getAllForms = (): Map<string, Step<any, any>> => {
        let forms = new Map<string, Step<any, any>>();
        for (const {ref, id} of this.props.steps) {
            forms.set(id, ref.current as Step<any, any>);
        }
        return forms;
    }

    private triggerFormSubmits(to: number, saving: boolean) {
        for (let i = 0; i < to; i++) {
            let {ref: {current}} = this.props.steps[i];
            current?.setIsSaving(saving);
            current?.triggerFormSubmit();
        }
    }

    private resetSteps(currentStep?: number) {
        let i = (currentStep !== undefined) ? currentStep : 0;

        if (currentStep !== undefined) {
            this.state.currentStep = currentStep;
            this.state.currentProgress = currentStep;

            let form = this.props.steps[currentStep - 1].ref.current;
            form?.reset({same: true, all: false});
        } else {
            this.state.currentStep = 1;
            this.state.currentProgress = 1;
        }

        for (i; i < this.props.steps.length; i++) {
            let step = this.props.steps[i].ref;
            step.current?.reset({same: false, all: true});
        }

        this.restoreFooter();
        this.props.steps[(currentStep !== undefined) ? (currentStep - 1) : 0].ref.current?.changeControlFooter();
        this.forceUpdate();
    }

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let newProgress: number = parseInt(title);

            if (newProgress > this.state.currentProgress) {
                this.state.currentProgress = newProgress;
            }

            this.state.currentStep = newProgress;
            this.restoreFooter();

            let step = this.props.steps[newProgress - 1].ref;
            if (!step.current?.isDisabled()) {
                step.current?.changeControlFooter();
            }

            this.forceUpdate();
        }
    }

    private getMatrix(): undefined | ReactNode {
        if (this.props.matrix === undefined) return null;

        this.triggerFormSubmits(this.state.currentProgress, true);
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
                if (n === this.state.currentStep) {
                    return true;
                }
            }
        }
        return false;
    }

}

export default StepComponent;
