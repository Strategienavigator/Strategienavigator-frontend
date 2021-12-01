import React, {Component, ReactNode, RefObject} from "react";
import {matchPath, Prompt, RouteComponentProps, StaticContext, withRouter} from "react-router";
import {Route, Switch} from "react-router-dom";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {ToolHome, ToolHomeInfo} from "./Home/ToolHome";
import {Card} from "react-bootstrap";
import {Loader} from "../Loader/Loader";
import {createSave, getSave, lockSave, updateSave} from "../API/calls/Saves";
import {Session} from "../Session/Session";
import {SaveResource} from "../Datastructures";
import {FormComponent} from "./FormComponent/FormComponent";
import * as H from "history";
import {CreateToolModal} from "./CreateToolModal/CreateToolModal";
import "./tool.scss";
import {ConfirmToolRouteChangeModal} from "./ConfirmToolRouteChangeModal/ConfirmToolRouteChangeModal";


type ToolViewValidation = {
    isNotOwn?: boolean
    isOtherTool?: boolean
    isLocked?: boolean
} | undefined;

interface ToolState {
    showInputModal: boolean
    showConfirmToolRouteChangeModal: boolean
    lastLocation: H.Location | null
    viewValidationError?: ToolViewValidation
    view?: SaveResource<any>
}

abstract class Tool extends Component<RouteComponentProps<{ id: string }>, ToolState> {
    // TOOL META DATA
    public isNew: boolean = false;
    public isView: boolean = false;
    public isHome: boolean = false;
    private readonly homePath?;
    private readonly newPath?;
    private readonly viewPath?;

    // TOOL INFO
    private toolName: string = "";
    private toolIcon?: IconDefinition;
    private toolID?: number;
    private readonly toolLink: string = "";
    private maintenance = false;

    // TOOL HOME
    private toolHomeRef?: RefObject<ToolHome>

    // CURRENT SAVE
    private currentSave?: SaveResource<any>;
    private currentSaveID?: number;
    private currentSaveName?: string;
    private currentSaveDescription?: string;

    protected constructor(props: RouteComponentProps<any, StaticContext, unknown> | Readonly<RouteComponentProps<any, StaticContext, unknown>>) {
        super(props);

        this.state = {
            showInputModal: true,
            lastLocation: null,
            showConfirmToolRouteChangeModal: false,
            viewValidationError: {}
        }
        this.toolLink = this.props.match.path;

        // setup route paths
        this.homePath = this.getLink();
        this.newPath = this.getLink() + "/new";
        this.viewPath = this.getLink() + "/:id";
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

    public lock = async () => {
        return await this.lockSave(true);
    }

    public unlock = async () => {
        return await this.lockSave(false);
    }

    public render = () => {
        if (this.maintenance) {
            return (
                <Card body>
                    Diese Analyse befindet sich im Wartungsmodus. Bitte Schauen Sie zu einem späteren Zeitpunkt erneut
                    vorbei.
                </Card>
            );
        }

        return (
            <>
                <Switch>
                    <Route exact path={this.homePath}>
                        {this.getRenderedToolHome()}
                    </Route>

                    <Route exact path={this.newPath}>
                        <CreateToolModal tool={this} history={this.props.history} location={this.props.location}
                                         match={this.props.match}/>
                    </Route>

                    <Route
                        exact
                        render={(props) => {
                            let ID = parseInt(props.match.params.id as string);

                            return (
                                <>
                                    <Loader payload={[() => this.validateViewID(ID)]} transparent
                                            alignment={"center"} fullscreen animate={false}>
                                        {(this.state.viewValidationError === undefined) ? (
                                            this.renderView(this.state.view as SaveResource<any>)
                                        ) : (
                                            <Card body>
                                                {(this.state.viewValidationError.isNotOwn) && (
                                                    <>Sie haben keine Berechtigung diesen Speicherstand anzusehen!</>
                                                )}
                                                {(this.state.viewValidationError.isOtherTool) && (
                                                    <>Bei dieser Analyse handelt es sich nicht um
                                                        eine <b>{this.toolName}</b>!</>
                                                )}
                                                {(this.state.viewValidationError.isLocked) && (
                                                    <>Dieser Speicherstand wird aktuell bearbeitet!</>
                                                )}
                                            </Card>
                                        )}
                                    </Loader>
                                    <Prompt message={this.denyRouteChange}/>
                                </>
                            );
                        }}
                        path={this.viewPath}
                    />
                </Switch>

                <ConfirmToolRouteChangeModal
                    show={this.state.showConfirmToolRouteChangeModal}
                    onNo={() => {
                        this.setState({
                            showConfirmToolRouteChangeModal: false,
                            lastLocation: null
                        });
                    }}
                    onYes={() => {
                        this.props.history.push(this.state.lastLocation?.pathname as string);
                        if ((this.state.lastLocation?.pathname as string).startsWith(this.toolLink)) {
                            this.setState({
                                showConfirmToolRouteChangeModal: false
                            });
                        }
                    }}
                />
            </>
        );
    }

    denyRouteChange = (location: H.Location): boolean => {
        this.setState({
            showConfirmToolRouteChangeModal: true,
            lastLocation: location
        });
        return (location.pathname === this.state.lastLocation?.pathname);
    }

    componentDidMount() {
        this.checkForPage(this.props.location.pathname);

        this.props.history.listen((location) => {
            this.checkForPage(location.pathname);
        });

        window.onbeforeunload = (e) => {
            if (this.isView) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            } else {
                delete e['returnValue'];
            }
        };
        window.onunload = async () => {
            let data = new FormData();
            data.append("_method", "PUT");
            data.append("lock", String(0));

            let headers = new Headers();
            headers.append("Authorization", "Bearer " + Session.getToken());

            await fetch(process.env.REACT_APP_API + "api/saves/" + this.currentSaveID, {
                method: "POST",
                body: data,
                headers: headers,
                keepalive: true
            });
        }
    }

    componentWillUnmount = async () => {
        window.onbeforeunload = null;
        window.onunload = null;
        if (this.hasCurrentSave()) {
            await this.unlock();
        }
    }

    public switchPage(page: string) {
        this.props.history.push(this.getLink() + "/" + page);
    }

    public save = async (data: object, forms: Map<string, FormComponent<any, any, any>>): Promise<boolean> => {
        let saveData = new FormData();
        saveData.append("data", JSON.stringify(data));
        saveData.append("name", this.currentSaveName as string);
        saveData.append("description", this.currentSaveDescription as string);

        let call;
        if (this.currentSaveID === undefined) {
            saveData.append("tool_id", String(this.toolID));
            call = await createSave(saveData, {errorCallback: this.onAPIError});

            if (call && call.success) {
                let callData = call.callData as SaveResource;
                this.currentSave = callData;
                this.currentSaveName = callData.name;
                this.currentSaveDescription = callData.description;
                this.currentSaveID = callData.id;
            }
        } else {
            call = await updateSave(this.currentSaveID, saveData, {errorCallback: this.onAPIError});
        }

        return (call !== null && call.success);
    }

    public abstract onAPIError(error: Error): void;

    public getCurrentSave(): SaveResource<any> | undefined {
        return this.currentSave;
    }

    public setCurrentSave = <D extends object>(currentSave: SaveResource<D>) => {
        this.currentSave = currentSave;
    }

    public setCurrentSaveDescription = (desc: string) => {
        this.currentSaveDescription = desc;
    }

    public setCurrentSaveName = (name: string) => {
        this.currentSaveName = name;
    }

    public hasCurrentSave(): boolean {
        return this.currentSaveDescription !== undefined && this.currentSaveName !== undefined;
    }

    public abstract getValues<D>(id: string): object | null;

    public abstract setValues(id: string, values: any): boolean;

    protected setID = (toolID: number) => {
        this.toolID = toolID;
    }

    protected abstract renderShortDescription(): ReactNode;

    protected abstract renderTutorial(): ReactNode;

    protected abstract renderView(save: SaveResource<any>): ReactNode;

    protected setToolname = (toolName: string) => {
        this.toolName = toolName;
    }

    protected setToolIcon = (toolIcon: IconDefinition) => {
        this.toolIcon = toolIcon;
    }

    private lockSave = async (lock: boolean) => {
        if (this.hasCurrentSave()) {
            return await lockSave(this.currentSaveID as number, lock, {errorCallback: this.onAPIError});
        }else{
            console.warn("WARNING: Tried to send lock request without a current save!")
        }
    }

    private checkForPage = (location: string) => {
        this.isNew = false;
        this.isHome = false;
        this.isView = false;

        if (matchPath(location, {path: this.newPath, exact: true})) {
            this.isNew = true;
        } else if (matchPath(location, {path: this.viewPath, exact: true})) {
            this.isView = true;
        } else if (matchPath(location, {path: this.homePath, exact: true})) {
            this.isHome = true;
        }
    }

    private validateViewID = async (ID: number) => {
        let call = await getSave(ID, {errorCallback: this.onAPIError});
        if (call) {
            let data = call.callData as SaveResource<any>;
            let isNotOwn, isOtherTool, isLocked;

            if (call.success) {
                data.data = JSON.parse(data.data);
                if (data.tool_id === this.toolID) {
                    if ((data.locked_by === null) || data.locked_by === Session.currentUser?.getID()) {
                        this.currentSave = data;
                        this.currentSaveName = data.name;
                        this.currentSaveDescription = data.description;
                        this.currentSaveID = data.id;

                        await this.lock();
                    } else {
                        isLocked = true;
                    }
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
                isOtherTool: isOtherTool,
                isLocked: isLocked
            };

            if (!isNotOwn && !isOtherTool && !isLocked) {
                validation = undefined;
            }

            this.setState({
                view: data,
                viewValidationError: validation
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
        let home = <ToolHome/>;

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

withRouter<RouteComponentProps<{ id: string }>, any>(Tool);

export {
    Tool
}
