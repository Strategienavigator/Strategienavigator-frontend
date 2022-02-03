import './tool-save-page.scss'
import React, {Component} from "react";
import {SaveResource} from "../../Datastructures";
import {Session} from "../../Session/Session";
import {Loader} from "../../Loader/Loader";
import {Prompt, RouteComponentProps} from "react-router";
import * as H from "history";
import {getSave, lockSave, updateSave} from "../../API/calls/Saves";
import {Tool} from "../Tool";
import {Messages} from "../../Messages/Messages";
import {Card} from "react-bootstrap";
import {ConfirmToolRouteChangeModal} from "../ConfirmToolRouteChangeModal/ConfirmToolRouteChangeModal";
import {Route} from "react-router-dom";
import {showErrorPage} from "../../../index";

type ToolViewValidation = {
    isNotOwn?: boolean
    isOtherTool?: boolean
    isLocked?: boolean
};


interface ToolSaveController<D> {
    save: () => Promise<boolean>
    onChanged: (newData: SaveResource<D>) => void
}

interface ToolSaveProps<D> {
    saveController: ToolSaveController<D>
    save: SaveResource<D>
    isSaving: boolean
}

interface ToolSavePageProps<D> {
    tool: Tool<D>
    element: (saveProps: ToolSaveProps<D>) => JSX.Element
}

interface ToolSavePageState<D> {
    save?: SaveResource<D>
    isSaving: boolean
    showConfirmToolRouteChangeModal: boolean
    lastLocation?: H.Location
    viewValidationError?: ToolViewValidation
}


class ToolSavePage<D> extends Component<ToolSavePageProps<D> & RouteComponentProps<any>, ToolSavePageState<D>> {

    private readonly saveController: ToolSaveController<D>;

    constructor(props: ToolSavePageProps<D> & RouteComponentProps<any>, context: any) {
        super(props, context);
        this.state = {
            showConfirmToolRouteChangeModal: false,
            isSaving: false
        }
        this.saveController = {
            save: this.save.bind(this),
            onChanged: this.updateSave.bind(this)
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
        if (this.state.save !== undefined) {
            // TODO use callAPI method
            let data = new FormData();
            data.append("_method", "PUT");
            data.append("lock", "0");

            let headers = new Headers();
            headers.append("Authorization", "Bearer " + Session.getToken());

            await fetch(process.env.REACT_APP_API + "api/saves/" + this.state.save.id, {
                method: "POST",
                body: data,
                headers: headers,
                keepalive: true
            });
        }
    }


    private getView() {
        if (this.state.save !== undefined) {
            return this.props.element({
                save: this.state.save,
                saveController: this.saveController,
                isSaving: this.state.isSaving
            });
        } else {
            showErrorPage(404);
        }
    }


    render() {
        let ID = parseInt(this.props.match.params.id as string);
        return (
            <Route>
                <Loader payload={[() => this.retrieveSave(ID)]} transparent
                        alignment={"center"} fullscreen animate={false}>
                    {(this.state.viewValidationError === undefined) ? this.getView() : (
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

    private save = async () => {
        if (this.hasCurrentSave()) {
            this.setState({
                isSaving: true
            });
            // saveData.append("tool_id", String(save.tool_id)); no need to send tool_id because it is immutable
            const call = await updateSave(this.state.save!, {errorCallback: this.onAPIError});

            this.setState({
                isSaving: false
            });

            return (call !== null && call.success);
        } else {
            return false;
        }

    }

    private updateSave(save: SaveResource<D>, callback?: () => void) {
        this.setState({
            save: save
        }, callback)

    }

    public onAPIError(error: Error): void {
        // TODO
        Messages.add(error.name, "DANGER", Messages.TIMER);
    }

    private hasCurrentSave(): boolean {
        return this.state.save !== undefined;
    }

    private lockSave = async (lock: boolean) => {
        if (this.hasCurrentSave()) {
            return await lockSave(this.state.save!.id as number, lock, {errorCallback: this.onAPIError});
        } else {
            console.warn("WARNING: Tried to send lock request without a current save!")
        }
    }

    private retrieveSave = async (ID: number) => {
        let call = await getSave<string>(ID, {errorCallback: this.onAPIError});
        if (call) {

            let isNotOwn, isOtherTool, isLocked;

            if (call.success) {
                let data: SaveResource<D> = {
                    ...call.callData.data,
                    data: JSON.parse(call.callData.data.data)
                };
                if (data.tool_id === this.props.tool.getID()) {
                    if ((data.locked_by === null) || data.locked_by === Session.currentUser?.getID()) {
                        await new Promise<void>(resolve => {
                            this.updateSave(data, resolve);
                        });

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
                save: undefined,
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
