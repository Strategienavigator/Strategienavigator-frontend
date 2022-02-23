import React, {Component, ComponentClass, FunctionComponent, ReactNode,} from "react";
import {Accordion, Col, Fade, Nav, NavItem, Row, Tab} from "react-bootstrap";
import {isDesktop} from "../../../Desktop";
import {Tool} from "../../Tool";
import "./step-component.scss";
import "./step-component-desk.scss";
import {Messages} from "../../../Messages/Messages";
import {StepProp} from "./Step/Step";
import {StepComponentHeader} from "./StepComponentHeader/StepComponentHeader";
import {StepComponentButtons} from "./StepComponentButtons/StepComponentButtons";
import ResetStepsModal from "./ResetStepsModal/ResetStepsModal";
import {ExportModal} from "../../ExportButton";
import {ToolSaveProps} from "../../ToolSavePage/ToolSavePage";
import {MatrixComponentProps} from "../../MatrixComponent/MatrixComponent";
import {UIError} from "../../../Error/UIErrors/UIError";
import {Exporter} from "../../../Export/Exporter";
import {Draft} from "immer";
import {IUIErrorContext} from "../../../Contexts/UIErrorContext/UIErrorContext";


export interface StepDefinition<T extends object> {
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

export interface StepDataHandler<T extends object> {
    /**
     * whether this step is selectable by the user
     * @param data
     */
    isUnlocked: (data: T) => boolean

    /**
     * change data in a way that isUnlocked returns true
     * @param data
     */
    fillFromPreviousValues: (data: Draft<T>) => void
    /**
     * Diese Methode soll die Daten so verändern, dass isUnlocked false returned
     * @param data
     */
    deleteData: (data: Draft<T>) => void

    /**
     * change data in a way that isUnlocked returns false
     * @param data
     */
    validateData: (data: T) => UIError[]
}

export interface StepComponentProps<D extends object> extends ToolSaveProps<D> {
    steps: StepDefinition<D>[]
    tool: Tool<D>
}

export interface StepController {
    /**
     * setzt den aktuellen schritt auf die den angegebenen Schritt
     * @param step null basierter index der Schritte
     * @returns ob der Schritt ausgewählt werden konnte
     */
    requestStep: (step: number) => void

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
    progress: number

    /**
     * if the current step has substeps which state is currently displayed
     */
    currentSubStep: number
    showResetModal: boolean
    showExportModal: boolean
}

class StepComponent<D extends object> extends Component<StepComponentProps<D> & { uiErrorContext: IUIErrorContext }, StepComponentState> {


    private readonly stepController: StepController;


    constructor(props: Readonly<StepComponentProps<D> & { uiErrorContext: IUIErrorContext }> | StepComponentProps<D> & { uiErrorContext: IUIErrorContext });
    constructor(props: StepComponentProps<D> & { uiErrorContext: IUIErrorContext }, context: any);
    constructor(props: Readonly<StepComponentProps<D> & { uiErrorContext: IUIErrorContext }> | StepComponentProps<D> & { uiErrorContext: IUIErrorContext }, context?: any) {
        super(props, context);
        this.stepController = {
            requestStep: this.changeStep,
            requestSubStep: this.setSubStep
        };
        const progress = StepComponent.getLastUnlockedStep(this.props.steps, this.props.save.data);

        if (progress < 0) {
            throw new Error("no step is unlocked")
        }

        this.state = {
            currentStep: progress,
            progress: progress,
            currentSubStep: StepComponent.getCurrentSubStepOfStep(this.props.steps, progress, this.props.save.data),
            showExportModal: false,
            showResetModal: false,
        }
    }

    private static getLastUnlockedStep<D extends object>(steps: StepDefinition<D>[], data: D) {
        let progress = -1;
        steps.forEach((step) => {
            if (step.dataHandler.isUnlocked(data)) {
                progress++;
            }
        });
        return progress;
    }

    render = () => {
        const customNextButton = this.getCustomNextButton();
        const header = <StepComponentHeader tool={this.props.tool}
                                            saveName={this.props.save.name}
                                            saveDescription={this.props.save.description}
                                            saveMetaChanged={this.changeSaveMeta}/>;

        const anyErrors = Object.keys(this.props.uiErrorContext.errors).length > 0;

        return (
            <>
                <Tab.Container
                    id="step"
                    activeKey={this.state.currentStep}
                    transition={Fade}
                    onSelect={this.onStepSelect}>
                    <Row className={"stepContainer"}>
                        {(!isDesktop()) && header}

                        <Col className={"stepTabContainer"}>
                            {(isDesktop()) && header}

                            <Nav className={"stepTabs"}>
                                {this.props.steps.map((value, index) => {
                                    return (
                                        <Nav.Link key={index} as={NavItem}
                                                  disabled={!this.withData(value.dataHandler.isUnlocked)}
                                                  eventKey={index}>{isDesktop() ? value.title : (index + 1)}</Nav.Link>

                                    );
                                })}
                            </Nav>


                            <StepComponentButtons
                                isMobile={!isDesktop()}
                                customNextButton={customNextButton}
                                nextDisabled={this.isLastStep() && !this.hasNextSubStep()}
                                isSaving={this.props.isSaving}
                                onNext={this.tryNextStep}
                                onReset={this.showResetModal}
                                onSave={this.save}
                                onExportClick={this.showExportModal}
                            />

                            {this.shouldMatrixRender() && (
                                this.getMatrix()
                            )}
                        </Col>
                        <Col className={"tabsContent"}>
                            <Tab.Content>
                                {this.props.steps.map((step, index) => {


                                    return (
                                        <Tab.Pane key={"2" + (index)} eventKey={index}>
                                            <div className={"stepTitle"}>{step.title}</div>

                                            {React.createElement(step.form, {
                                                save: this.props.save,
                                                saveController: this.props.saveController,
                                                isSaving: this.props.isSaving,
                                                id: step.id,
                                                disabled: index < this.state.progress /*|| !this.withData(step.dataHandler.isUnlocked)*/,
                                                stepController: this.stepController,
                                                currentSubStep: this.state.currentSubStep,
                                                validationFailed: index === this.state.progress && anyErrors
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

    private onExport = (exporter: Exporter<D>) => {
        exporter.export(this.props.save);

        this.setState({
            showExportModal: false
        });
    }

    private onResetCurrent = () => {
        this.clearErrors();
        this.setState({showResetModal: false, currentSubStep: 0, progress: this.state.currentStep});
        this.resetStepsUntil(this.state.currentStep);
    }

    private onResetAll = () => {
        this.clearErrors();
        this.setState({showResetModal: false, currentStep: 0, currentSubStep: 0, progress: 0});
        this.resetAllSteps();
    }

    private getCurrentStep = () => {
        return this.props.steps[this.state.currentStep];
    }

    private getData() {
        return this.props.save.data;
    }

    private changeSaveMeta = (name: string, description: string) => {
        this.props.saveController.onChanged(save => {
            if (name !== save.name) {
                save.name = name;
            }

            if (description !== save.description) {
                save.description = description;
            }
        });
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


    /**
     * does call the given function with the current data objects as first argument. If function isn't defined undefined is returned
     * @param fn
     * @private
     */
    private withData<E>(fn: (data: D) => E): E
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
     *
     * @param index
     * @private
     */
    private resetStepsUntil(index: number) {
        this.props.saveController.onChanged(save => {
            if (index < this.props.steps.length) {
                const newData = save.data;
                for (let i = this.props.steps.length - 1; i >= index; i--) {
                    this.props.steps[i]?.dataHandler.deleteData(newData);
                }
                this.props.steps[index]?.dataHandler.fillFromPreviousValues(newData);

            }
        });
    }

    private resetAllSteps() {
        this.resetStepsUntil(0);
    }

    public tryNextStep = (): void => {

        this.clearErrors();
        if (this.hasNextSubStep()) {

            const validated = this.validateSubStep(this.state.currentStep, this.state.currentSubStep);

            if (validated) {
                // force for performance reasons (no duplicate check of validation)
                this.nextSubStep(true);
                return;
            }
        }

        const validated = this.validateStep(this.state.currentStep);

        if (validated) {
            this.nextStep();
        }
    }

    private nextSubStep = (force: boolean = false) => {
        this.setSubStep(this.state.currentSubStep + 1, force)
    }

    private setSubStep = (step: number, force: boolean = false) => {
        if (force || this.withData(this.getCurrentStep().subStep?.isStepUnlocked.bind(this, step))) {
            this.setState({
                currentSubStep: step
            });
            return true;
        }
        return false;

    }

    /**
     * changes the currently visible step to the next one. Does only change if the next step is unlocked or it is unlockable.
     *
     * Next step is unlocked if possible.
     */
    private nextStep = () => {


        const currentStep = this.getCurrentStep();

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
                    this.changeStep(newStepIndex, () => {
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
                    this.props.saveController.onChanged(save => {
                        nextStep.dataHandler.fillFromPreviousValues(save.data);
                    });
                    return true;
                }
            }
        }
        return false;

    }

    private save = async () => {
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
    }

    private getCustomNextButton = (step?: number) => {
        let localStep = step;
        if (localStep === undefined)
            localStep = this.state.currentStep;
        return this.props.steps[localStep].subStep?.customNextButton;
    };

    private onStepSelect = (title: string | null) => {
        if (title !== null) {
            let newProgress: number = parseInt(title);
            this.changeStep(newProgress);
        }
    }

    /**
     * Ändert den aktuellen angezeigten Schritt, wenn dieser ein valider wert ist
     * @param step
     * @param callback wird ausgeführt wenn der state geändert wurde oder bereits diesen schritt war
     * @private
     */
    private changeStep(step: number, callback: undefined | (() => void) = undefined): void {
        if (step < this.props.steps.length) {
            if (this.state.currentStep !== step) {
                const hasSubSteps = this.hasSubSteps(step);
                let newSubStep = 0;
                if (hasSubSteps) {

                    newSubStep = StepComponent.getCurrentSubStepOfStep(this.props.steps, step, this.props.save.data);
                }

                let newProgress = this.state.progress;
                if (this.state.progress < step) {
                    newProgress = step;
                }
                this.setState({
                    currentStep: step,
                    currentSubStep: newSubStep,
                    progress: newProgress
                }, callback);
            } else {
                if (callback !== undefined)
                    callback();
            }
        }


        /* the state to get into this step should never exist

        if (step > this.state.currentProgress) {
            this.setState({
                currentProgress: step
            });
        }*/
    }

    /**
     * returns the first unfinished sub step of the given step. If every sub step is unlocked the first step is returned
     *
     *
     * @param steps
     * @param step
     * @param save
     * @private the index of the sub step
     */
    private static getCurrentSubStepOfStep<D extends object>(steps: Array<StepDefinition<D>>, step: number, data: D) {
        let subStepProgress = 0;

        if (steps.length > step) {
            const subStep = steps[step].subStep;
            if (subStep !== undefined) {

                const count = subStep.getStepCount(data);
                for (let i = 0; i < count; i++) {
                    if (subStep.isStepUnlocked(i, data)) {
                        subStepProgress++;
                    }
                }
                if (subStepProgress === count || subStepProgress === -1) {
                    subStepProgress = 0;
                }
            }
        }

        return subStepProgress;
    }

    /**
     * does return the matrix if the current sub step has one
     * @private
     */
    private getMatrix(): undefined | ReactNode {
        let step = this.getCurrentStep();
        if (step.matrix !== undefined) {
            let matrix = React.createElement(step.matrix, {
                tool: this.props.tool,
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


    private validateStep = (step: number): boolean => {
        const errors = this.withData(this.props.steps[step].dataHandler.validateData);
        if (errors.length > 0) {
            this.putErrors(errors);
            Messages.add(
                "Überprüfen Sie Ihre Eingaben!",
                "DANGER",
                Messages.TIMER
            );
            return false;
        } else {
            return true;
        }
    };

    private validateSubStep = (step: number, subStep: number): boolean => {
        const errors = this.withData(this.props.steps[step].subStep?.validateStep.bind(this, subStep));
        if (errors !== undefined && errors.length > 0) {
            this.putErrors(errors);
            return false;
        } else {
            return true;
        }
    };

    private putErrors(errors: UIError[]) {
        this.props.uiErrorContext.putErrors(errors);
    }

    private clearErrors() {
        this.props.uiErrorContext.clearErrors();
    }
}

export default StepComponent;
