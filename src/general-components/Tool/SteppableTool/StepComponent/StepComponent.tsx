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
import {UIError} from "../../../Error/ErrorBag";
import {Exporter} from "../../../Export/Exporter";


export interface StepDefinition<T> {
    id: string
    title: string
    dataHandler: StepDataHandler<T>
    form: FunctionComponent<StepProp<T>> | ComponentClass<StepProp<T>>
    matrix?: FunctionComponent<MatrixComponentProps<T>> | ComponentClass<MatrixComponentProps<T>>
    subStep?: SubStepDefinition<T>
}


/**
 * Keine Methode darf einen internen state benötigen. Also sind instanzvariablen eigentlich ausgeschlossen
 */
export interface SubStepDefinition<T> {

    /**
     * gibt an wie viele sub-steps es in diesem step gibt.
     *
     * Sollte nach der fillFromPreviousValues methode immer dieselbe zahl zurückgeben.
     * @param data
     */
    getStepCount: (data: T) => number

    /**
     * validates the given step. If the returned array has at least one error with level error the validation is considered failed
     * @param subStep zero based index of the sub-steps
     * @param data current data
     */
    validateStep: (subStep: number, data: T) => UIError[]

    /**
     * whether this step is selectable by the user
     * @param data
     */
    isStepUnlocked: (subStep: number, data: T) => boolean

    /**
     * wenn nicht undefined wird dieser CustomNextButton im Step Component angezeigt, wenn nicht der letzte sub-step erreicht ist.
     */
    customNextButton?: CustomNextButton
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
     * Diese Methode soll die Daten so verändern, dass isUnlocked false returned
     * @param data
     */
    deleteData: (data: T) => T

    /**
     * change data in a way that isUnlocked returns false
     * @param data
     */
    validateData: (data: T) => UIError[]
}

export interface StepComponentProps<D> extends ToolSaveProps<D> {
    steps: StepDefinition<D>[]
    tool: Tool<D>
}

export interface StepController {
    /**
     * setzt den aktuellen schritt auf die den angegebenen Schritt
     * @param step null basierter index der Schritte
     * @returns ob der Schritt ausgewählt werden konnte
     */
    requestStep: (step: number) => boolean

    /**
     * setzt den aktuellen schritt auf die den angegebenen Schritt
     * @param step null basierter index der Schritte
     * @returns ob der Schritt ausgewählt werden konnte
     */
    requestSubStep: (step: number) => boolean

}

export type CustomNextButton = {
    text: string
};

export interface StepComponentState {
    /**
     * Aktuell sichtbarer Schritt
     */
    currentStep: number;
    /**
     * maximal freigeschalteter Schritt
     */
    // currentProgress: number

    /**
     * if the current step has substeps which state is currently displayed
     */
    currentSubStep: number
    showResetModal: boolean
    showExportModal: boolean
    hasCustomNextButton: boolean
    customNextButton?: CustomNextButton
}

class StepComponent<D> extends Component<StepComponentProps<D>, StepComponentState> {


    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>


    private readonly stepController: StepController;


    constructor(props: Readonly<StepComponentProps<D>> | StepComponentProps<D>);
    constructor(props: StepComponentProps<D>, context: any);
    constructor(props: Readonly<StepComponentProps<D>> | StepComponentProps<D>, context?: any) {
        super(props, context);
        this.stepController = {
            requestStep: this.changeStep,
            requestSubStep: this.setSubStep
        };
        let progress = -1;
        this.props.steps.forEach((step) => {
            if (step.dataHandler.isUnlocked(this.getData())) {
                progress++;
            }
        });

        // TODO put in function, this part is copied into changeStep
        let subStepProgress = 0;
        const subStep = this.props.steps[progress].subStep;
        const data = this.props.save.data;
        if (subStep !== undefined) {

            const count = subStep.getStepCount(data);
            for (let i = 0; i < count; i++) {
                if (subStep.isStepUnlocked(i, data)) {
                    subStepProgress++;
                }
            }
        }

        this.state = {
            currentStep: progress,
            currentSubStep: subStepProgress,
            showExportModal: false,
            showResetModal: false,
            hasCustomNextButton: false,
        }
    }

    render = () => {
        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.state.currentStep}
                    transition={Fade}
                    onSelect={this.onStepSelect}>
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
                                    return (
                                        <Nav.Link key={index} as={NavItem}
                                                  disabled={!this.withData(value.dataHandler.isUnlocked)}
                                                  eventKey={index}>{isDesktop() ? value.title : (index + 1)}</Nav.Link>

                                    );
                                })}
                            </Nav>

                            {(isDesktop()) && (
                                <DesktopButtons
                                    tool={this.props.tool}
                                    customNextButton={this.state.customNextButton}
                                    nextDisabled={this.isLastStep() && !this.hasNextSubStep()}
                                    isSaving={this.props.isSaving}
                                    onNext={this.tryNextStep}
                                    onReset={this.showResetModal}
                                    onSave={this.save}
                                    onExportClick={this.showExportModal}
                                />
                            )}

                            {this.shouldMatrixRender() && (
                                this.getMatrix()
                            )}
                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.props.steps.map((value, index) => {


                                    return (
                                        <Tab.Pane key={"2" + (index)} eventKey={index}>
                                            <div className={"stepTitle"}>{value.title}</div>

                                            {React.createElement(value.form, {
                                                ...this.props, // TODO ...(this.props as ToolSaveProps<D>)
                                                id: value.id,
                                                disabled: !this.withData(value.dataHandler.isUnlocked),
                                                stepController: this.stepController,
                                                currentSubStep: this.state.currentSubStep,
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
                    onYes={this.onResetCurrent}
                    onAllReset={this.onResetAll}
                    onNo={this.hideResetModal}
                />

                <ExportModal
                    onClose={this.hideExportModal}
                    onSelect={this.onExport}
                    show={this.state.showExportModal}
                    tool={this.props.tool}
                />
            </>
        );
    }

    private showResetModal = () => {
        this.setState({showResetModal: true})
    }

    private hideResetModal = () => {
        this.setState({showResetModal: false})
    }

    private showExportModal = () => {
        this.setState({
            showExportModal: true
        });
    }

    private hideExportModal = () => {
        this.setState({
            showExportModal: false
        });
    }

    private onExport = (exporter:Exporter<D>) => {
        exporter.export(this.props.save);

        this.setState({
            showExportModal: false
        });
    }

    private onResetCurrent = () => {
        this.setState({showResetModal: false});
        this.resetStepsUntil(this.state.currentStep);
    }

    private onResetAll = () => {
        this.setState({showResetModal: false});
        this.resetAllSteps();
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
        return this.props.steps[this.state.currentStep];
    }

    private getData() {
        return this.props.save.data;
    }

    private hasSubSteps(stepIndex: number = this.state.currentStep): boolean {
        const step = this.props.steps[stepIndex];
        if (step.subStep === undefined) {
            return false;
        }

        const stepCount = this.withData(step.subStep.getStepCount);
        return stepCount > 1;

    }

    private hasNextSubStep(): boolean {
        if (!this.hasSubSteps())
            return false;
        const step = this.getCurrentStep();
        if (step.subStep === undefined) {
            return false;
        }

        const stepCount = this.withData(step.subStep.getStepCount);
        return this.state.currentSubStep < (stepCount - 1);

    }

    private isStepUnlocked = (step: number) => {
        return this.withData(this.props.steps[step].dataHandler.isUnlocked);
    }


    private withData<E>(fn: (data: D) => E): E
    private withData(fn: undefined): undefined
    private withData<E>(fn: ((data: D) => E) | undefined): E | undefined
    private withData<E>(fn: ((data: D) => E) | undefined): E | undefined {
        if (fn !== undefined) {
            return fn(this.props.save.data);
        }
        return undefined;
    }

    private isAt = (currentStep: number): boolean => {
        return this.state.currentStep === currentStep;
    }

    private isFirstStep = (): boolean => {
        return this.state.currentStep <= 0;
    }

    private isLastStep = (): boolean => {
        return this.state.currentStep >= this.props.steps.length - 1;
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

    public tryNextStep = async () => {
        const currentStep = this.getCurrentStep();

        if (this.hasNextSubStep()) {

            this.setSubStep(this.state.currentSubStep + 1);

        }
        const errors = this.withData(currentStep.dataHandler.validateData);

        if (errors.length < 1) {
            await this.nextStep();
        }

    }

    private nextSubStep = () => {
        this.setSubStep(this.state.currentSubStep + 1)
    }

    private setSubStep = (step: number) => {
        if (this.withData(this.getCurrentStep().subStep?.isStepUnlocked.bind(this, step))) {
            this.setState({
                currentSubStep: step
            });
            return true;
        }
        return false;

    }

    private nextStep = async () => {
        this.restoreFooter();


        const currentStep = this.getCurrentStep();
        let isProgress: boolean = false;
        let newStepIndex = this.state.currentStep + 1;

        if (newStepIndex < this.props.steps.length) {
            const newStep = this.props.steps[newStepIndex];
            const newUnlocked = this.withData(newStep.dataHandler.isUnlocked);

            if (newUnlocked) {
                this.changeStep(newStepIndex);
                return;
            }

            const currentValid = this.withData(currentStep.dataHandler.validateData).length === 0;

            if (currentValid) {
                if (this.unlockNextStep()) {
                    isProgress = true;
                    this.changeStep(newStepIndex, () => {
                        if (this.isLastStep()) {
                            this.restoreFooter();
                        }
                        this.save();
                    });

                }
            }
        }
    }

    private unlockNextStep(): boolean {
        const currenStep = this.getCurrentStep();

        if (this.withData(currenStep.dataHandler.validateData).length === 0) {
            const nextStepIndex = this.state.currentStep + 1;

            if (nextStepIndex < this.props.steps.length) {
                const nextStep = this.props.steps[nextStepIndex];

                if (!this.withData(nextStep.dataHandler.isUnlocked)) {
                    const save = this.props.save;
                    save.data = this.withData(nextStep.dataHandler.fillFromPreviousValues);
                    this.props.saveController.onChanged(save);
                    return true;
                }
            }
        }
        return false;

    }

    private save = async () => {
        // TODO move buttons in render method
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
        // TODO move buttons in render method
        this.context.disableItem(3, false);
    }

    private addCustomNextButton = (text: string, callback: () => any) => {
        let button = {text: text, callback: callback, icon: faCaretRight};

        this.setState({
            hasCustomNextButton: true,
            customNextButton: button
        });

        this.context.setItem(3, {button: button});
    }

    private addCustomPreviousButton = (text: string, callback: () => any) => {
        this.context.setItem(1, {button: {text: text, callback: callback, icon: faCaretLeft}});
    }

    private restoreFooter = () => {
        this.context.setItem(1, {
            reset: () => {
                this.setState({
                    showResetModal: true
                })
            }
        });


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
            nextStep: this.tryNextStep.bind(this)
        });
        this.context.disableItem(4, this.isLastStep());

        this.setState({
            hasCustomNextButton: false,
            customNextButton: undefined
        });
    }

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let newProgress: number = parseInt(title);
            this.changeStep(newProgress);
        }
    }

    private changeStep(step: number, callback: undefined | (() => void) = undefined) {

        if (this.withData(this.props.steps[step].dataHandler.isUnlocked)) {
            let subStepProgress = 0;
            if (this.hasSubSteps(step)) {
                // TODO put into function (same snippet as in constructor
                const subStep = this.props.steps[step].subStep;
                if (subStep !== undefined) {

                    const count = this.withData(subStep.getStepCount);
                    for (let i = 0; i < count; i++) {
                        if (this.withData(subStep.isStepUnlocked.bind(this, i))) {
                            subStepProgress++;
                        }
                    }
                    if(subStepProgress === count){
                        subStepProgress = 0;
                    }
                }

            }
            this.setState({
                currentStep: step,
                currentSubStep: subStepProgress,
            }, callback);
            return true;
        }
        return false;


        /* the state to get into this step should never exist

        if (step > this.state.currentProgress) {
            this.setState({
                currentProgress: step
            });
        }*/
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
