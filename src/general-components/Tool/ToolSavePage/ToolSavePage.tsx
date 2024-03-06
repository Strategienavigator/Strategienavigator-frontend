import './tool-save-page.scss'
import React, {Component, ReactNode} from "react";
import {
    SaveResource,
    SharedSavePermission,
    SharedSavePermissionDefault,
} from "../../Datastructures";
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
import {ModalCloseable} from "../../Modal/ModalCloseable";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import FAE from '../../Icons/FAE';
import {getSaveResource} from "../../API/calls/SaveResources";
import {legacyShowErrorPage} from "../../LegacyErrorPageAdapter";


interface ToolSaveController<D> {
    save: () => Promise<boolean>
    onChanged: (changes: (save: WritableDraft<SaveResource<D>>) => void) => void
    updateSaveFromRemote: () => void
}

interface ToolSaveProps<D extends object> {
    saveController: ToolSaveController<D>
    resourceManager: ResourceManager
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
    // connection?: Echo;
    // channel?: PresenceChannel;
}

export interface ResourceManager {
    resources: ResourcesType,
    onChanged: (name: string, file: File) => void,
    hasResource: (name: string) => boolean,
    getData: (name: string) => Blob | null,
    getText: (name: string) => Promise<string | null>,
    getBlobURL: (name: string) => string | null
}

export type SingleResource = {
    file: File,
    url: string,
    changed: boolean
};
export type ResourcesType = Map<string, SingleResource>;

class ToolSavePage<D extends object> extends Component<ToolSavePageProps<D> & RouteComponentProps<any>, ToolSavePageState<D>> {

    private readonly saveController: ToolSaveController<D>;
    /**
     * Speichert, ob der Speicherstand seit dem letzten Speichern verändert wurde
     * @private
     */
    private saveDirty: boolean = false;

    // private updateTimeout: NodeJS.Timeout | undefined;
    // private updateTimeoutMS: number = 370;

    private readonly resourceManager: ResourceManager;
    private readonly resources: ResourcesType = new Map();
    private onUnmount: (() => void)[];

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
        this.resourceManager = {
            resources: this.resources,
            onChanged: this.resourceChanged.bind(this),
            hasResource: this.hasResource.bind(this),
            getData: this.getResourceData.bind(this),
            getText: this.getResourceText.bind(this),
            getBlobURL: this.getBlobURL.bind(this)
        }
        this.onUnmount = [];
    }

    componentDidMount = async () => {
        window.addEventListener("beforeunload", this.onBeforeUnload);
        window.addEventListener("beforeunload", this.onUnloadUnLock);
        await this.firstLoad();
    }

    componentWillUnmount = async () => {
        const onUnmount = this.onUnmount;
        this.onUnmount = [];
        if (this.state.save !== undefined) {
            await this.unlock(this.state.save);
        }

        for (const onUnmountCallback of onUnmount) {
            onUnmountCallback();
        }

        // this.closeWebsocketConnection();

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

    render() {
        return (
            <Route>
                <SharedSaveContextComponent permission={this.getPermissionOfSave()}>
                    <Loader payload={[]} loaded={!this.state.isLoading} transparent
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
        let save;
        try {
            save = await this.retrieveSave(ID);
        } catch (e: any) {
            if (e.message === this.INTERRUPTED) {
                return;
            } else {
                throw e;
            }
        }


        let isLocked: boolean | undefined = undefined;
        // let socketInfo: { connection: any; channel: any; } | undefined = undefined;

        if (save) {
            // socketInfo = await this.createSocketConnection(save);
            isLocked = await this.checkLockStatus(save);

            if (save /*&& socketInfo*/ && isLocked !== undefined) {
                this.setState({
                    save: save,
                    isLoading: false,
                    isLocked: isLocked,
                    // connection: socketInfo.connection,
                    // channel: socketInfo.channel
                });
            } else {
                legacyShowErrorPage(404);
                return;
            }
        } else {
            legacyShowErrorPage(404);
            return;
        }
    }

    // private closeWebsocketConnection() {
    //     this.state.connection?.disconnect();
    // }

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
                resourceManager: this.resourceManager,
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
        // this.closeWebsocketConnection();

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

    private resourcesMapToFileArray = (resources: ResourcesType): File[] => {
        let files: File[] = [];
        resources.forEach((value, key) => {
            files.push(
                new File([value.file], key, {type: value.file.type, lastModified: value.file.lastModified})
            );
        });
        return files;
    }

    private resourceChanged = (name: string, file: File) => {
        this.resources.set(name, {
            file: file,
            url: URL.createObjectURL(file),
            changed: true
        });
    }

    private getResourceData = (name: string): Blob | null => {
        let res = this.resources.get(name);
        if (res) {
            return res.file;
        }
        return null;
    }

    private getResourceText = async (name: string): Promise<string | null> => {
        let res = this.resources.get(name);
        if (res) {
            return await res.file.text();
        }
        return null;
    }

    private getBlobURL = (name: string): string | null => {
        let res = this.resources.get(name);
        if (res) {
            return res.url;
        }
        return null;
    }

    private hasResource = (name: string): boolean => {
        return this.resources.has(name);
    }

    private save = async () => {
        if (this.state.save !== undefined) {
            this.setState({
                isSaving: true
            });
            // saveData.append("tool_id", String(save.tool_id)); no need to send tool_id because it is immutable
            const call = await updateSave(
                this.state.save!,
                this.resources,
                {
                    errorCallback: this.onAPIError
                }
            );

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
                newSave = produce(this.state.save, changes);
            }
            this.saveDirty = true;
        }

        this.setState({
            save: newSave
        }, callback);
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
            let save;
            try {
                save = await this.retrieveSave(this.state.save.id);
            } catch (e: any) {
                if (e.message === this.INTERRUPTED) {
                    return;
                } else {
                    throw e;
                }
            }

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

    private readonly INTERRUPTED = "interrupted";
    private retrieveSave = async (ID: number): Promise<SaveResource<D> | undefined> => {
        let abort = false;
        const onAbort = () => {
            abort = true;
        }
        this.onUnmount.push(onAbort);
        let call = await getSave<any>(ID, {errorCallback: this.onAPIError});

        if (abort) {
            throw new Error(this.INTERRUPTED);
        } else {
            const index = this.onUnmount.findIndex(onAbort)
            this.onUnmount.splice(index, 1);
        }
        if (call && call.success) {
            if (call.callData.tool_id === this.props.tool.getID()) {
                let save: SaveResource<D> = call.callData;
                save.data = JSON.parse(call.callData.data);

                // load resources
                for (const resource of save.resources) {
                    let res = await getSaveResource(save, resource.name, {errorCallback: this.onAPIError});
                    if (res !== null && res.success) {
                        let blob = res.callData;
                        let put: string | Blob = "";
                        if (blob instanceof Blob) {
                            put = blob;
                        } else {
                            put = JSON.stringify(blob, null, 2);
                        }
                        let file = new File([put], resource.name, {
                            type: res.response.headers.get("Content-Type") ?? ((blob instanceof Blob) ? blob.type : "")
                        });
                        this.resources.set(resource.name, {
                            file: file,
                            url: URL.createObjectURL(file),
                            changed: false
                        });
                    }
                }
                return save;
            } else {
                legacyShowErrorPage(403);
                return;
            }
        } else {
            legacyShowErrorPage(404);
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
