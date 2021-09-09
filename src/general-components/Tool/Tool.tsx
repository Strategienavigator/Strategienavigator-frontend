import React, {Component, FormEvent, ReactElement, ReactNode, RefObject} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {Route, Switch} from "react-router-dom";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ToolHome, ToolHomeInfo} from "./Home/ToolHome";
import {extractFromForm} from "../FormHelper";
import {Button, Card, Form, Modal} from "react-bootstrap";
import {Loader} from "../Loader/Loader";
import {createSave, getSave, updateSave} from "../API/calls/Saves";
import {Session} from "../Session/Session";
import {SaveResource} from "../Datastructures";
import StepComponent, {StepComponentProps, StepProp} from "./StepComponent/StepComponent";

import "./tool.scss";
import {FormComponent} from "./FormComponent/FormComponent";


type ToolViewValidation = {
    isNotOwn?: boolean
    isOtherTool?: boolean
} | undefined;

interface ToolState {
    showInputModal: boolean
    isSaving: boolean
    viewValidationError?: ToolViewValidation
    view?: SaveResource
    nameError?: {
        empty?: boolean
    }
    descriptionError?: {
        empty?: boolean
    }
}

abstract class Tool extends Component<RouteComponentProps<any>, ToolState> {
    // TOOL INFO
    private toolName: string = "";
    private toolIcon?: IconDefinition;
    private toolID?: number;
    private maintenance = false;
    private readonly toolLink: string = "";

    // TOOL HOME
    private toolHomeRef?: RefObject<ToolHome>

    // STEP COMPONENT
    private steps: Array<StepProp> = [];

    // CURRENT SAVE
    private currentSave?: SaveResource;
    private currentSaveID?: number;
    private currentSaveName?: string;
    private currentSaveDescription?: string;
    private readonly stepComponent: RefObject<StepComponent>;

    protected constructor(props: RouteComponentProps<any, StaticContext, unknown> | Readonly<RouteComponentProps<any, StaticContext, unknown>>) {
        super(props);

        this.state = {
            showInputModal: true,
            isSaving: false,
            viewValidationError: {}
        }
        this.stepComponent = React.createRef<StepComponent>();
        this.toolLink = this.props.match.path;

        this.props.history.listen(() => {
            this.currentSaveID = undefined;
            this.currentSaveName = undefined;
            this.currentSaveDescription = undefined;
            this.currentSave = undefined;
        });
    }

    public getLink(): string {
        return this.toolLink;
    }

    public getToolName = (): string => {
        return this.toolName;
    }

    public getToolIcon = (): IconDefinition | undefined => {
        return this.toolIcon;
    }

    public getID = (): number | undefined => {
        return this.toolID;
    }

    public setMaintenance(maintenance: boolean) {
        this.maintenance = maintenance;
    }

    public hasTutorial = (): boolean => {
        let tutorial = this.renderTutorial();
        return (tutorial !== null && tutorial !== undefined);
    }

    public render = () => {
        let ID = this.getPathParam() as number;

        if (this.maintenance) {
            return (
                <Card body>
                    Diese Analyse ist in Bearbeitung.
                </Card>
            );
        }

        return (
            <Switch>
                <Route exact path={this.getLink()}>
                    {this.getRenderedToolHome()}
                </Route>

                <Route exact path={this.getLink() + "/new"}>
                    {!this.hasCurrentTool() ? (
                        <div>
                            <Loader payload={[]} transparent animate={false} fullscreen alignment={"center"}
                                    loaded={false}/>
                            {this.getNameAndDescInputModal()}
                        </div>
                    ) : this.getStepComponent()}
                </Route>

                <Route exact path={this.getLink() + "/:id"}>
                    <Loader payload={[() => this.validateViewID(ID)]} transparent
                            alignment={"center"} fullscreen animate={false}>
                        {(this.state.viewValidationError === undefined) ? this.renderView(this.state.view as SaveResource) : (
                            <Card body>
                                {(this.state.viewValidationError.isNotOwn) && (
                                    <>Sie haben keine Berechtigung diesen Speicherstand anzusehen!</>
                                )}
                                {(this.state.viewValidationError.isOtherTool) && (
                                    <>Bei dieser Analyse handelt es sich nicht um eine <b>{this.toolName}</b>!</>
                                )}
                            </Card>
                        )}
                    </Loader>
                </Route>

                {(this.state.showInputModal) && this.getNameAndDescInputModal()}

                {(this.state.isSaving) && (
                    <Loader payload={[]} fullscreen transparent loaded={false}/>
                )}
            </Switch>
        );
    }

    public switchPage(page: string) {
        this.props.history.push(this.getLink() + "/" + page);
    }

    public save = async (data: object, forms: Map<string, FormComponent<any, any>>): Promise<boolean> => {
        this.setState({
            isSaving: true
        });

        let saveData = new FormData();
        saveData.append("data", JSON.stringify(data));
        saveData.append("name", this.currentSaveName as string);
        saveData.append("description", this.currentSaveDescription as string);

        let call;
        if (this.currentSaveID === undefined) {
            // Create new
            saveData.append("tool_id", String(this.toolID));
            call = await createSave(saveData, Session.getToken());
        } else {
            // Update current
            call = await updateSave(this.currentSaveID, saveData, Session.getToken());
        }

        this.setState({
            isSaving: false
        });
        return call.success;
    }

    protected getStepComponent(props?: StepComponentProps) {
        return (
            <StepComponent
                onSave={async (data, forms) => {
                    return await this.save(data, forms);
                }}
                header={this.getToolName()}
                ref={this.stepComponent}
                steps={this.steps}
                tool={this}
                {...props}
            />
        );
    }

    protected addStep(step: StepProp) {
        this.steps.push(step);
    }

    protected hasCurrentTool(): boolean {
        return this.currentSaveDescription !== undefined && this.currentSaveName !== undefined;
    }

    protected setID = (toolID: number) => {
        this.toolID = toolID;
    }

    protected abstract renderToolHome(): ReactElement<any, "ToolHome"> | null | undefined;

    protected abstract renderShortDescription(): ReactNode;

    protected abstract renderTutorial(): ReactNode;

    protected abstract renderView(tool: SaveResource): ReactNode;

    protected abstract renderNew(): ReactNode;

    protected setToolname = (toolName: string) => {
        this.toolName = toolName;
    }

    protected setToolIcon = (toolIcon: IconDefinition) => {
        this.toolIcon = toolIcon;
    }

    private getPathParam = (): number | string => {
        let ID: string | number = this.props.history.location.pathname.replace(this.getLink() + "/", "");

        if (!isNaN(parseInt(ID))) {
            ID = parseInt(ID);
            this.currentSaveID = ID;
            return ID;
        } else {
            if (ID !== "new" && this.getLink() !== ID) {
                this.props.history.push("/");
            }
        }
        return ID;
    }

    private validateViewID = async (ID: number) => {
        let call = await getSave(ID, Session.getToken());
        let data = call.callData as SaveResource;

        let isNotOwn, isOtherTool;

        if (call.success) {
            if (data.tool_id === this.toolID) {
                this.currentSave = data;
                this.currentSaveName = data.name;
                this.currentSaveDescription = data.description;
                this.currentSaveID = data.id;
            } else {
                this.currentSaveName = data.name;
                call.success = false;
                isOtherTool = true;
            }
        } else {
            isNotOwn = true;
        }

        let validation: ToolViewValidation = {
            isNotOwn: isNotOwn,
            isOtherTool: isOtherTool
        };

        if (!isNotOwn && !isOtherTool) {
            validation = undefined;
        }

        this.setState({
            view: data,
            viewValidationError: validation
        });
    }

    private getNameAndDescInputModal = () => {
        return (
            <Modal
                show={this.state.showInputModal}
                backdrop="static"
                centered
                keyboard={true}
            >
                <Modal.Header>
                    <Modal.Title>Bezeichnung und Beschreibung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Für Ihre neue Analyse müssen Sie nur noch eine Bezeichnung und Beschreibung angeben.

                    <br/>

                    <Form className={"mt-3"} onSubmit={(e) => this.finishNameAndDescInput(e)} id={"toolhomeInput"}>
                        <Form.Floating className={"mb-2"}>
                            <Form.Control
                                id="name"
                                type="text"
                                name={"name"}
                                size={"sm"}
                                placeholder="Bezeichnung"
                            />
                            <Form.Label htmlFor={"name"}>Bezeichnung</Form.Label>
                        </Form.Floating>

                        {(this.state.nameError) && (
                            <div className={"feedbackContainer mb-2"}>
                                {this.state.nameError.empty && (
                                    <div className={"feedback DANGER"}>
                                        Bitte geben Sie eine Bezeichnung an.
                                    </div>
                                )}
                            </div>
                        )}

                        <Form.Floating className={"mb-2"}>
                            <Form.Control
                                as="textarea"
                                style={{height: 100}}
                                id="description"
                                name={"description"}
                                rows={10}
                                size={"sm"}
                                placeholder="Beschreibung"
                            />
                            <Form.Label htmlFor={"description"}>Beschreibung</Form.Label>
                        </Form.Floating>

                        {(this.state.descriptionError) && (
                            <div className={"feedbackContainer mb-2"}>
                                {this.state.descriptionError.empty && (
                                    <div className={"feedback DANGER"}>
                                        Bitte geben Sie eine Beschreibung an.
                                    </div>
                                )}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        this.props.history.goBack();
                    }} variant={"light"} type={"button"}>
                        Zurück
                    </Button>
                    <Button variant={"dark"} type={"submit"} form={"toolhomeInput"}>
                        Jetzt beginnen
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    private finishNameAndDescInput = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            nameError: undefined,
            descriptionError: undefined
        });

        let error = false;
        let name: string = extractFromForm(e, "name") as string;
        let desc: string = extractFromForm(e, "description") as string;

        if (name === "" || name === null || name === undefined) {
            error = true;
            this.setState({
                nameError: {
                    empty: true
                }
            });
        }
        if (desc === "" || desc === null || desc === undefined) {
            error = true;
            this.setState({
                descriptionError: {
                    empty: true
                }
            });
        }

        if (!error) {
            this.currentSaveName = name;
            this.currentSaveDescription = desc;

            this.setState({
                showInputModal: false
            });
        }
    }

    private getRenderedToolHome = () => {
        let ref: RefObject<ToolHome>;
        if (this.toolHomeRef) {
            ref = this.toolHomeRef;
        } else {
            ref = React.createRef();
        }
        this.toolHomeRef = ref;

        let home = this.renderToolHome();

        if (home === undefined || home === null) {
            home = <ToolHome/>;
        }

        let info: ToolHomeInfo = {
            shortDescription: this.renderShortDescription(),
            tutorial: this.renderTutorial()
        }

        return React.cloneElement(home, {
            ref: ref,
            info: Object.assign(info, home.props.info),
            tool: this
        });
    }
}

export {
    Tool
}