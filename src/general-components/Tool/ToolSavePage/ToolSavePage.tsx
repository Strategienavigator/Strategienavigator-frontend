import './tool-save-page.scss'
import React, {Component, ReactNode} from "react";
import {SaveResource, SharedSavePermission} from "../../Datastructures";
import {Session} from "../../Session/Session";
import {Loader} from "../../Loader/Loader";
import {Prompt, RouteComponentProps} from "react-router";
import * as H from "history";
import {getSave, lockSave, updateSave} from "../../API/calls/Saves";
import {Tool} from "../Tool";
import {Messages} from "../../Messages/Messages";
import {Button, Modal} from "react-bootstrap";
import {ConfirmToolRouteChangeModal} from "../ConfirmToolRouteChangeModal/ConfirmToolRouteChangeModal";
import {Route} from "react-router-dom";
import produce from "immer";
import {WritableDraft} from "immer/dist/types/types-external";
import {UIErrorContextComponent} from "../../Contexts/UIErrorContext/UIErrorContext";
import {SharedSaveContextComponent} from "../../Contexts/SharedSaveContextComponent";
import {EditSavesPermission, hasPermission} from "../../Permissions";
import {showErrorPage} from "../../../index";
import {ModalCloseable} from "../../Modal/ModalCloseable";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import FAE from '../../Icons/FAE';


interface ToolSaveController<D> {
    save: () => Promise<boolean>
    onChanged: (changes: (save: WritableDraft<SaveResource<D>>) => void) => void
}

interface ToolSaveProps<D extends object> {
    saveController: ToolSaveController<D>
    save: SaveResource<D>
    isSaving: boolean
}

interface ToolSavePageProps<D extends object> {
    tool: Tool<D>
    element: (saveProps: ToolSaveProps<D>) => JSX.Element
}

interface ToolSavePageState<D extends object> {
    save?: SaveResource<D>
    isSaving: boolean
    showConfirmToolRouteChangeModal: boolean
    lastLocation?: H.Location,
    isLocked: boolean
}


class ToolSavePage<D extends object> extends Component<ToolSavePageProps<D> & RouteComponentProps<any>, ToolSavePageState<D>> {

    private readonly saveController: ToolSaveController<D>;
    /**
     * Speichert ob der Speicherstand seit dem letzten Speichern verändert wurde
     * @private
     */
    private saveDirty: boolean = false;

    constructor(props: ToolSavePageProps<D> & RouteComponentProps<any>, context: any) {
        super(props, context);
        this.state = {
            showConfirmToolRouteChangeModal: false,
            isSaving: false,
            isLocked: true
        }
        this.saveController = {
            save: this.save.bind(this),
            onChanged: this.updateSave.bind(this)
        }
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.onBeforeUnload);
        window.addEventListener("beforeunload", this.onUnloadUnLock);
    }

    componentWillUnmount = async () => {
        if (this.state.save !== undefined) {
            await this.unlock(this.state.save);
        }

        window.removeEventListener("beforeunload", this.onBeforeUnload);
        window.removeEventListener("beforeunload", this.onUnloadUnLock);
    }

    onUnloadUnLock = async () => {
        let save = this.state.save;
        if (save) {
            await this.lockSave(save, false, true);
        }
    }

    render() {
        let ID = parseInt(this.props.match.params.id as string);

        return (
            <Route>
                <SharedSaveContextComponent save={this.state.save!}>
                    <Loader payload={[() => this.retrieveSave(ID)]} transparent
                            alignment={"center"} fullscreen animate={false}>

                        <UIErrorContextComponent>
                            {this.getView()}
                        </UIErrorContextComponent>

                        <ModalCloseable
                            show={this.state.isLocked}
                            backdrop centered
                            onHide={() => {
                                this.setState({
                                    isLocked: false
                                });
                            }}
                        >
                            <Modal.Body>
                                Dieser Speicherstand wird aktuell bearbeitet, daher können Sie diesen nur beobachten...
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant={"dark"}
                                    onClick={() => {
                                        this.setState({
                                            isLocked: false
                                        });
                                    }}
                                >
                                    <FAE icon={faCheck} /> Ok
                                </Button>
                                <Button
                                    variant={"primary"}
                                    onClick={() => {
                                        this.props.history.goBack();
                                    }}
                                >
                                    Zurück
                                </Button>
                            </Modal.Footer>
                        </ModalCloseable>
                    </Loader>

                    <Prompt message={this.denyRouteChange}/>
                    <ConfirmToolRouteChangeModal
                        show={this.state.showConfirmToolRouteChangeModal}
                        onNo={this.hideRouteChangeModal}
                        onYes={this.performRouteChange}
                    />
                </SharedSaveContextComponent>
            </Route>
        );
    }

    denyRouteChange = (location: H.Location): boolean => {
        // Dont show if save is unchanged
        if (!this.shouldPreventRouteChange())
            return true;


        this.setState({
            showConfirmToolRouteChangeModal: true,
            lastLocation: location
        });
        return (location.pathname === this.state.lastLocation?.pathname);
    }

    public onAPIError(error: Error): void {
        Messages.add(error.message, "DANGER", Messages.TIMER);
    }

    public lock = async (save: SaveResource<any>) => {
        return await this.lockSave(save, true);
    }

    public unlock = async (save: SaveResource<any>) => {
        return await this.lockSave(save, false);
    }

    private onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (this.shouldPreventRouteChange()) {
            e.preventDefault();
            e.returnValue = "";
            return "";
        }
        return undefined;
    }

    private getView(): ReactNode {
        if (this.state.save !== undefined) {
            return this.props.element({
                save: this.state.save,
                saveController: this.saveController,
                isSaving: this.state.isSaving
            });
        } else {
            // showErrorPage(404);
            return "";
        }
    }

    private hideRouteChangeModal = () => {
        this.setState({
            showConfirmToolRouteChangeModal: false,
            lastLocation: undefined
        });
    };

    private performRouteChange = () => {
        this.props.history.push(this.state.lastLocation?.pathname as string);
        if ((this.state.lastLocation?.pathname as string).startsWith(this.props.tool.getLink())) {
            this.setState({
                showConfirmToolRouteChangeModal: false
            });
        }
    };

    /**
     * Gibt zurück, ob ein Dialog angezeigt werden soll, der um Bestätigung bittet, ob die Seite verlassen werden soll
     */
    private shouldPreventRouteChange = (): boolean => {
        return this.saveDirty;
    }

    private save = async () => {
        if (this.state.save !== undefined) {
            this.setState({
                isSaving: true
            });
            // saveData.append("tool_id", String(save.tool_id)); no need to send tool_id because it is immutable
            const call = await updateSave(this.state.save!, {errorCallback: this.onAPIError});

            this.setState({
                isSaving: false
            });
            const success = call !== null && call.success;
            if (success)
                this.saveDirty = false;
            return success;
        } else {
            return false;
        }

    }

    private updateSave(changes: ((save: WritableDraft<SaveResource<D>>) => void) | SaveResource<D>, callback?: () => void) {
        if (typeof changes === "object") {
            this.setState({
                save: changes
            }, callback);
        } else {
            if (this.state.save !== undefined) {
                this.setState({
                    save: produce(this.state.save, changes)
                }, callback)
            }
            this.saveDirty = true;
        }
    }

    private lockSave = async (save: SaveResource<any>, lock: boolean, keepalive?: boolean) => {
        if (lock && save.locked_by !== null) {
            return;
        }
        if (!lock && save.locked_by !== Session.currentUser?.getID()) {
            return;
        }

        return await lockSave(save.id, lock, {
            errorCallback: this.onAPIError,
            keepalive: keepalive
        });
    }

    private retrieveSave = async (ID: number) => {
        let call = await getSave<any>(ID, {errorCallback: this.onAPIError});

        if (call && call.success) {
            let isLocked;
            let data: SaveResource<D> = {
                ...call.callData,
                data: JSON.parse(call.callData.data)
            };

            if (data.tool_id === this.props.tool.getID()) {
                data.permission = data.permission ?? {
                    permission: SharedSavePermission.OWNER,
                    created_at: ""
                };
                let permission = data.permission.permission;

                isLocked = hasPermission(permission, EditSavesPermission);

                if (
                    data.locked_by === null ||
                    data.locked_by === Session.currentUser?.getID()
                ) {
                    isLocked = false;
                }

                if (isLocked) {
                    data.permission.permission = SharedSavePermission.READ;
                }

                await this.lock(data);

                if (!data.locked_by) {
                    data.locked_by = Session.currentUser!.getID();
                }

                await new Promise<void>(resolve => {
                    this.updateSave(data, resolve);
                });

                this.setState({
                    isLocked: isLocked
                });
            } else {
                showErrorPage(403);
                return;
            }
        } else {
            showErrorPage(404);
            return;
        }
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
