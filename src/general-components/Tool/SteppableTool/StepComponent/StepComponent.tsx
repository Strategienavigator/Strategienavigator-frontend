import React, {Component, ComponentClass, FunctionComponent, ReactNode,} from "react";
import {Accordion, Col, Fade, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../../../Desktop";
import {faCaretLeft, faCaretRight, faSave} from "@fortawesome/free-solid-svg-icons/";
import {Tool} from "../../Tool";
import "./step-component.scss";
import "./step-component-desk.scss";
import {Messages} from "../../../Messages/Messages";
import {StepProp} from "./Step/Step";
import {StepComponentHeader} from "./StepComponentHeader/StepComponentHeaderProp";
import {FooterContext} from "../../../Contexts/FooterContextComponent";
import {DesktopButtons} from "./DesktopButtons/DesktopButtons";
import {ResetStepsModal} from "./ResetStepsModal/ResetStepsModal";
import {faFileExport} from "@fortawesome/free-solid-svg-icons";
import {ExportModal} from "../../ExportButton";
import {ToolSaveProps} from "../../ToolSavePage/ToolSavePage";
import {MatrixComponentProps} from "../../MatrixComponent/MatrixComponent";
import {SaveResource} from "../../../Datastructures";


export interface StepDefinition<T> {
    id: string
    title: string
    dataHandler: StepDataHandler<T>
    form: FunctionComponent<StepProp<T>> | ComponentClass<StepProp<T>>
    matrix?: FunctionComponent<MatrixComponentProps<T>> | ComponentClass<MatrixComponentProps<T>>
}

export interface StepDataHandler<T> {
    /**
     * whether this step is selectable by the user
     * @param data
     */
    isUnlocked: (data: T) => boolean

    /**
     * change data in a way that isUnlocked returns true
     * @param data
     */
    fillFromPreviousValues: (data: T) => T
    /**
     * change data in a way that isUnlocked returns false
     * @param data
     */
    deleteData: (data: T) => T
}

export interface StepComponentProps<D> extends ToolSaveProps<D> {
    steps: StepDefinition<D>[]
    tool: Tool<D>
}

export type CustomNextButton = {
    text: string
    callback: () => void
} | null;

export interface StepComponentState {
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
}

class StepComponent<D> extends Component<StepComponentProps<D>, StepComponentState> {


    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>


    constructor(props: Readonly<StepComponentProps<D>> | StepComponentProps<D>);
    constructor(props: StepComponentProps<D>, context: any);
    constructor(props: Readonly<StepComponentProps<D>> | StepComponentProps<D>, context?: any) {
        super(props, context);
        let progress = 0;
        this.props.steps.forEach((step) => {
            if (step.dataHandler.isUnlocked(this.getData())) {
                progress++;
            }
        });

        this.state = {
            currentProgress: progress,
            currentStep: progress,
            showExportModal: false,
            showResetModal: false,
            hasCustomNextButton: false,
            customNextButton: null,
        }
    }

    render = () => {
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
                            <StepComponentHeader {...this.props} />
                        )}

                        <Col className={"stepTabContainer"}>
                            {(isDesktop()) && (
                                <StepComponentHeader {...this.props} />
                            )}

                            <Nav className={"stepTabs"}>
                                {this.props.steps.map((value, index) => {
                                    const i = index + 1;
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
                                    isSaving={this.props.isSaving}
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
                                                // title: value.title,
                                                disabled: this.state.currentProgress > index + 1,
                                                ...this.props // TODO ...(this.props as ToolSaveProps<D>)
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
                        this.resetStepsUntil(this.state.currentStep);
                    }}
                    onAllReset={() => {
                        this.setState({showResetModal: false});
                        this.resetAllSteps();
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
                        exporter.export(this.props.save);

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
        return this.props.steps[this.state.currentStep - 1];
    }

    private getCurrentProgress = () => {
        return this.props.steps[this.state.currentProgress - 1];
    }

    private getData() {
        return this.props.save.data;
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

    /**
     * Resetet alle steps, von hinten bis zu dem angegebenen index
     * @param index
     * @private
     */
    private resetStepsUntil(index: number) {
        if (index < this.props.steps.length) {
            let newData = {...this.props.save.data} as D;
            for (let i = this.props.steps.length; i >= index; i--) {
                newData = this.props.steps[i]?.dataHandler.deleteData(newData) ?? newData;
            }
            newData = this.props.steps[index]?.dataHandler.fillFromPreviousValues(newData);

            let save = {
                ...this.props.save,
                data: newData
            } as SaveResource<D>
            this.props.saveController.onChanged(save);
        }
    }

    private resetAllSteps() {
        this.resetStepsUntil(0);
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
        // TODO move in render method
        this.context.disableItem(3, true);


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
        // TODO move in render method
        this.context.disableItem(3, false);
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

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let newProgress: number = parseInt(title);


            this.setState({
                currentStep: newProgress
            });

            if (newProgress > this.state.currentProgress) {
                this.setState({
                    currentProgress: newProgress
                });
            }
        }
    }

    private getMatrix(): undefined | ReactNode {
        let step = this.getCurrentStep();
        if (step.matrix !== undefined) {
            let matrix = React.createElement(step.matrix, {
                tool: this.props.tool,
                stepComponent: this,
                data: this.props.save.data
            });
            const getMatrixContainer = () => {
                return (
                    <div className={"matrixContainer"}>
                        <div className={"matrix"}>
                            {matrix}
                        </div>
                    </div>
                );
            }

            if (isDesktop()) {
                return getMatrixContainer();
            } else {
                return (
                    <Accordion className={"matrixAccordion"}>
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
    }

    private shouldMatrixRender(): boolean {
        return this.getCurrentStep().matrix !== undefined
    }

}

export default StepComponent;
