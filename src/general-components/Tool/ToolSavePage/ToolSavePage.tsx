import './tool-save-page.scss'
import React, {Component, ReactNode} from "react";
import {
    LiveSaveUpdateResource,
    SaveResource,
    SharedSavePermission,
    SharedSavePermissionDefault,
} from "../../Datastructures";
import {Session} from "../../Session/Session";
import {Loader} from "../../Loader/Loader";
import {Prompt, RouteComponentProps} from "react-router";
import * as H from "history";
import {broadcastSavePatches, getSave, lockSave, updateSave} from "../../API/calls/Saves";
import {Tool} from "../Tool";
import {Messages} from "../../Messages/Messages";
import {Button, Modal} from "react-bootstrap";
import {ConfirmToolRouteChangeModal} from "../ConfirmToolRouteChangeModal/ConfirmToolRouteChangeModal";
import {Route} from "react-router-dom";
import produce, {applyPatches} from "immer";
import {WritableDraft} from "immer/dist/types/types-external";
import {UIErrorContextComponent} from "../../Contexts/UIErrorContext/UIErrorContext";
import {SharedSaveContextComponent} from "../../Contexts/SharedSaveContextComponent";
import {EditSavesPermission, hasPermission} from "../../Permissions";
import {showErrorPage} from "../../../index";
import {ModalCloseable} from "../../Modal/ModalCloseable";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import FAE from '../../Icons/FAE';
import {createSocketConnection} from "../../../setupEcho";
import Echo, {PresenceChannel} from "laravel-echo";
import {WebsocketChannelContextComponent} from "../../Contexts/WebsocketChannelContextComponent";


interface ToolSaveController<D> {
    save: () => Promise<boolean>
    onChanged: (changes: (save: WritableDraft<SaveResource<D>>) => void) => void
    updateSaveFromRemote: () => void
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
    isLoading: boolean
    save?: SaveResource<D>
    isSaving: boolean
    showConfirmToolRouteChangeModal: boolean
    lastLocation?: H.Location,
    isLocked: boolean,
    connection?: Echo;
    channel?: PresenceChannel;
}


class ToolSavePage<D extends object> extends Component<ToolSavePageProps<D> & RouteComponentProps<any>, ToolSavePageState<D>> {

    private readonly saveController: ToolSaveController<D>;
    /**
     * Speichert ob der Speicherstand seit dem letzten Speichern verändert wurde
     * @private
     */
    private saveDirty: boolean = false;

    private updateTimeout: NodeJS.Timeout | undefined;
    private updateTimeoutMS: number = 370;

    constructor(props: ToolSavePageProps<D> & RouteComponentProps<any>, context: any) {
        super(props, context);
        this.state = {
            showConfirmToolRouteChangeModal: false,
            isSaving: false,
            isLocked: false,
            isLoading: true
        }
        this.saveController = {
            save: this.save.bind(this),
            onChanged: this.updateSave.bind(this),
            updateSaveFromRemote: this.updateSaveFromRemote
        }
    }

    componentDidMount = async () => {
        window.addEventListener("beforeunload", this.onBeforeUnload);
        window.addEventListener("beforeunload", this.onUnloadUnLock);
        await this.firstLoad();
    }

    componentWillUnmount = async () => {
        if (this.state.save !== undefined) {
            await this.unlock(this.state.save);
        }

        this.closeWebsocketConnection();

        window.removeEventListener("beforeunload", this.onBeforeUnload);
        window.removeEventListener("beforeunload", this.onUnloadUnLock);
    }

    onUnloadUnLock = async () => {
        let save = this.state.save;
        if (save) {
            await this.lockSave(save, false, true);
        }

        if (save) {
            await this.unlock(save);
        }
    }

    createSocketConnection = async (save: SaveResource<D>): Promise<{
        connection: Echo,
        channel: PresenceChannel
    }> => {
        let channelName = "savechannel." + save.id;
        let connection = createSocketConnection();

        connection.connector.pusher.connection.bind("connected", () => {
            console.log("Websocket connected!"); // TODO: in state umwandeln
        });
        connection.connector.pusher.connection.bind("disconnected", () => {
            console.log("Websocket disconnected!"); // TODO: in state umwandeln
        });

        let channel = connection.join(channelName);
        channel.subscribed(() => {
            console.log("channel subscribed");  // TODO: in state umwandeln
        });

        /**
         * Watchout for updates
         */
        channel.listen("LiveSaveUpdate", (message: LiveSaveUpdateResource) => {
            let userID = Session.currentUser?.getID();

            if (userID !== message.sender.id) {
                this.remoteUpdateSave(message);
            }
        });

        return {
            connection: connection,
            channel: channel
        };
    }

    render() {
        return (
            <Route>
                <SharedSaveContextComponent permission={this.getPermissionOfSave()}>
                    <Loader payload={[]} loaded={!this.state.isLoading} transparent
                            alignment={"center"} fullscreen animate={false}>
                        <WebsocketChannelContextComponent
                            channel={this.state.channel ?? null}
                            connection={this.state.connection ?? null}
                        >
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
                                    Dieser Speicherstand wird aktuell bearbeitet, daher können Sie diesen nur
                                    beobachten...
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
                                        <FAE icon={faCheck}/> Ok
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
                        </WebsocketChannelContextComponent>
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
        // Don't show if save is unchanged
        if (!this.shouldPreventRouteChange())
            return true;

        this.setState({
            showConfirmToolRouteChangeModal: true,
            lastLocation: location
        });
        return (location.pathname === this.state.lastLocation?.pathname);
    }

    public onAPIError(error: Error): void {
        // TODO: remove later
        Messages.add(error.message, "DANGER", Messages.TIMER);
    }

    public lock = async (save: SaveResource<any>) => {
        return await this.lockSave(save, true);
    }

    public unlock = async (save: SaveResource<any>) => {
        return await this.lockSave(save, false);
    }

    private firstLoad = async () => {
        let ID = parseInt(this.props.match.params.id as string);
        let save = await this.retrieveSave(ID);

        let isLocked: boolean | undefined = undefined;
        let socketInfo: { connection: any; channel: any; } | undefined = undefined;

        if (save) {
            socketInfo = await this.createSocketConnection(save);
            isLocked = await this.checkLockStatus(save);

            if (save && socketInfo && isLocked !== undefined) {
                this.setState({
                    save: save,
                    isLoading: false,
                    isLocked: isLocked,
                    connection: socketInfo.connection,
                    channel: socketInfo.channel
                });
            } else {
                showErrorPage(404);
                return;
            }
        } else {
            showErrorPage(404);
            return;
        }
    }

    private closeWebsocketConnection() {
        this.state.connection?.disconnect();
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
        this.closeWebsocketConnection();

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
            console.log('this.state',this.state)
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

    private updateSave = (changes: ((save: WritableDraft<SaveResource<D>>) => void) | SaveResource<D>, callback?: () => void) => {
        let newSave;
        if (typeof changes === "object") {
            newSave = changes;
        } else {
            if (this.state.save !== undefined) {
                newSave = produce(this.state.save, changes, async (patches, inversePatches) => {
                    if (this.updateTimeout) {
                        clearTimeout(this.updateTimeout);
                    }

                    this.updateTimeout = setTimeout(async () => {
                        await broadcastSavePatches(this.state.save!.id, patches);
                    }, this.updateTimeoutMS);
                });
            }
            this.saveDirty = true;
        }

        this.setState({
            save: newSave
        }, callback);
    }

    private remoteUpdateSave = (message: LiveSaveUpdateResource) => {
        let patches = JSON.parse(message.patches);
        let old = this.state.save;

        if (old !== undefined) {
            let newSave = applyPatches<SaveResource<D>>(old, patches);
            this.setState({
                save: newSave
            });
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

    private updateSaveFromRemote = async () => {
        this.setState({isLoading: true});
        if (this.state.save) {
            let save = await this.retrieveSave(this.state.save.id);
            if (save) {
                this.setState({
                    save: save,
                    isLoading: false
                });
            }
        }
        this.setState({isLoading: false});
    }

    private checkLockStatus = async (save: SaveResource<D>): Promise<boolean> => {
        save.permission = save.permission ?? {
            permission: SharedSavePermissionDefault,
            created_at: ""
        };
        let permission = save.permission.permission;
        let isLocked = hasPermission(permission, EditSavesPermission);

        if (
            save.locked_by === null ||
            save.locked_by === Session.currentUser?.getID()
        ) {
            isLocked = false;
        }

        await this.lock(save);

        if (save.locked_by === null) {
            save.locked_by = Session.currentUser!.getID();
        }
        return isLocked;
    }

    private retrieveSave = async (ID: number): Promise<SaveResource<D> | undefined> => {
        let call = await getSave<any>(ID, {errorCallback: this.onAPIError});

        if (call && call.success) {
            if (call.callData.tool_id === this.props.tool.getID()) {
                let save: SaveResource<D> = call.callData;
                save.data = JSON.parse(call.callData.data);
                return save;
            } else {
                showErrorPage(403);
                return;
            }
        } else {
            showErrorPage(404);
            return;
        }
    }

    private getPermissionOfSave(): SharedSavePermission {
        let s = this.state.save;
        if (!s) {
            return SharedSavePermission.READ;
        }
        let isLocked = s.locked_by ? s.locked_by !== Session.currentUser?.getID() : false;
        if (!s.permission) {
            return s.owner.id === Session.currentUser?.getID() ?
                isLocked ?
                    SharedSavePermission.READ :
                    SharedSavePermission.ADMIN :
                SharedSavePermission.READ;
        }

        if (isLocked) {
            return SharedSavePermission.READ;
        }
        return s.permission.permission;
    }
}


export type{
    ToolSavePageProps,
    ToolSavePageState,
    ToolSaveProps,
    ToolSaveController
}

export {
    ToolSavePage
}
