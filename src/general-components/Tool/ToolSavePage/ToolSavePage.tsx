import './tool-save-page.scss'
import React, {Component, ComponentClass, JSXElementConstructor, ReactElement, ReactNode} from "react";
import {SaveResource} from "../../Datastructures";
import {CurrentSave} from "../CurrentSave";
import {Session} from "../../Session/Session";
import {Loader} from "../../Loader/Loader";
import {Prompt, RouteComponentProps, withRouter} from "react-router";
import * as H from "history";
import {FormComponent} from "../FormComponent/FormComponent";
import {createSave, getSave, lockSave, updateSave} from "../../API/calls/Saves";
import {Tool} from "../Tool";
import {Messages} from "../../Messages/Messages";
import {Card} from "react-bootstrap";
import {ConfirmToolRouteChangeModal} from "../ConfirmToolRouteChangeModal/ConfirmToolRouteChangeModal";
import {Route} from "react-router-dom";
import {LoadingButton} from "../../LoadingButton/LoadingButton";

type ToolViewValidation = {
    isNotOwn?: boolean
    isOtherTool?: boolean
    isLocked?: boolean
};

interface ToolSavePageProps<D> {
    tool: Tool<D>
    element: (saveProps:ToolSaveProps<D>) => JSX.Element
}

interface ToolSaveController<D> {
    save: () => Promise<boolean>
    onChanged: (newData: SaveResource<D>) => void
}

interface ToolSaveProps<D> {
    saveController: ToolSaveController<D>
    save: SaveResource<D>
}

interface ToolSavePageState<D> {
    save?: SaveResource<D>
    showConfirmToolRouteChangeModal: boolean
    lastLocation?: H.Location
    viewValidationError?: ToolViewValidation
}


class ToolSavePage<D> extends Component<ToolSavePageProps<D> & RouteComponentProps<any>, ToolSavePageState<D>> {

    // CURRENT SAVE
    public currentSave: CurrentSave<D> = new CurrentSave();


    constructor(props: ToolSavePageProps<D> & RouteComponentProps<any>, context: any) {
        super(props, context);
        this.state = {
            showConfirmToolRouteChangeModal: false,
        }
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onBeforeUnload);
        window.addEventListener("unload", this.onUnload);
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.onBeforeUnload);
        window.removeEventListener("unload", this.onUnload);

        if (this.hasCurrentSave()) {
            this.unlock();
        }
    }


    private onBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
        return "";
    }

    private onUnload = async () => {
        let data = new FormData();
        data.append("_method", "PUT");
        data.append("lock", "0");

        let headers = new Headers();
        headers.append("Authorization", "Bearer " + Session.getToken());

        await fetch(process.env.REACT_APP_API + "api/saves/" + this.currentSave.getID(), {
            method: "POST",
            body: data,
            headers: headers,
            keepalive: true
        });
    }


    private getView(){
        React.createElement(this.props.element,)
    }


    render() {
        let ID = parseInt(this.props.match.params.id as string);
        return (
            <Route>
                <Loader payload={[() => this.validateViewID(ID)]} transparent
                        alignment={"center"} fullscreen animate={false}>
                    {(this.state.viewValidationError === undefined) ? this.props.children : (
                        <Card body>
                            {(this.state.viewValidationError.isNotOwn) && (
                                <>Sie haben keine Berechtigung diesen Speicherstand anzusehen!</>
                            )}
                            {(this.state.viewValidationError.isOtherTool) && (
                                <>Bei dieser Analyse handelt es sich nicht um
                                    eine <b>{this.props.tool.getToolName()}</b>!</>
                            )}
                            {(this.state.viewValidationError.isLocked) && (
                                <>Dieser Speicherstand wird aktuell bearbeitet!</>
                            )}
                        </Card>
                    )}
                </Loader>


                <Prompt message={this.denyRouteChange}/>
                <ConfirmToolRouteChangeModal
                    show={this.state.showConfirmToolRouteChangeModal}
                    onNo={() => {
                        this.setState({
                            showConfirmToolRouteChangeModal: false,
                            lastLocation: undefined
                        });
                    }}
                    onYes={() => {
                        this.props.history.push(this.state.lastLocation?.pathname as string);
                        if ((this.state.lastLocation?.pathname as string).startsWith(this.props.tool.getLink())) {
                            this.setState({
                                showConfirmToolRouteChangeModal: false
                            });
                        }
                    }}
                />
            </Route>
        );
    }

    denyRouteChange = (location: H.Location): boolean => {
        this.setState({
            showConfirmToolRouteChangeModal: true,
            lastLocation: location
        });
        return (location.pathname === this.state.lastLocation?.pathname);
    }

    public save = async (data: object, forms: Map<string, FormComponent<any, any, any>>): Promise<boolean> => {
        let saveData = new FormData();
        saveData.append("data", JSON.stringify(data));
        saveData.append("name", this.currentSave.getName() as string);
        saveData.append("description", this.currentSave.getDesc() as string);

        let call;


        if (!this.currentSave.isset()) {
            saveData.append("tool_id", String(this.props.tool.getID()));
            call = await createSave<D>(saveData, {errorCallback: this.onAPIError});

            if (call && call.success) {
                let callData = call.callData;
                this.currentSave.setSave(callData.data);
            }
        } else {
            let id = this.currentSave.getID()!;
            call = await updateSave(id, saveData, {errorCallback: this.onAPIError});
        }

        return (call !== null && call.success);
    }

    public onAPIError(error: Error): void {
        // TODO
        Messages.add("FEHLER", "DANGER", Messages.TIMER);
    }

    public hasCurrentSave(): boolean {
        return this.currentSave.getDesc() !== undefined && this.currentSave.getName() !== undefined;
    }

    public getValues<D>(id: string) {

    }

    public setValues(id: string, values: D) {

    }

    private lockSave = async (lock: boolean) => {
        if (this.hasCurrentSave()) {
            return await lockSave(this.currentSave.getID() as number, lock, {errorCallback: this.onAPIError});
        } else {
            console.warn("WARNING: Tried to send lock request without a current save!")
        }
    }

    private validateViewID = async (ID: number) => {
        let call = await getSave(ID, {errorCallback: this.onAPIError});
        if (call) {
            let data = call.callData as SaveResource<any>;
            let isNotOwn, isOtherTool, isLocked;

            if (call.success) {
                data.data = JSON.parse(data.data);
                if (data.tool_id === this.props.tool.getID()) {
                    if ((data.locked_by === null) || data.locked_by === Session.currentUser?.getID()) {
                        this.currentSave.setSave(data);
                        await this.lock();
                    } else {
                        isLocked = true;
                    }
                } else {
                    call.success = false;
                    isOtherTool = true;
                }
            } else {
                isNotOwn = true;
            }

            let validation: ToolViewValidation | undefined = {
                isNotOwn: isNotOwn,
                isOtherTool: isOtherTool,
                isLocked: isLocked
            };

            if (!isNotOwn && !isOtherTool && !isLocked) {
                validation = undefined;
            }

            this.setState({
                save: data,
                viewValidationError: validation
            });
        }
    }


    public lock = async () => {
        return await this.lockSave(true);
    }

    public unlock = async () => {
        return await this.lockSave(false);
    }
}


export type{
    ToolSavePageProps,
    ToolSavePageState,
    ToolSaveProps
}

export {
    ToolSavePage
}
