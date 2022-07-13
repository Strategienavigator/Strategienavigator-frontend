import React, {Component, ReactNode} from "react";
import {Tool} from "../Tool";
import {Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {faInfoCircle, faSortAmountDown, faSortAmountUp} from "@fortawesome/free-solid-svg-icons";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";

import "./tool-home.scss";
import {FooterContext} from "../../Contexts/FooterContextComponent";
import {SaveResourceList} from "./SaveResourceList/SaveResourceList";
import {PaginationLoader, PaginationPages} from "../../API/PaginationLoader";
import {SimpleSaveResource} from "../../Datastructures";
import {Session} from "../../Session/Session";
import {deleteSave, getSaves} from "../../API/calls/Saves";
import {DeleteSaveModal} from "./DeleteSaveModal/DeleteSaveModal";
import FAE from "../../Icons/FAE";
import {SaveInvitation} from "../../Sharing/SaveInvitation";


export interface ToolHomeInfo {
    shortDescription?: ReactNode
    tutorial?: ReactNode
}

export interface ToolHomeProps {
    tool: Tool<any>
    info?: ToolHomeInfo
}

export interface SavesPaginationSetting {
    orderDesc: boolean
}

interface ToolHomeState {
    showTutorial: boolean
    saves?: PaginationPages<SimpleSaveResource>
    paginationSettings: SavesPaginationSetting
    isLoadingPage: boolean
    showDeleteModal: boolean
    showInviteModal: null | SimpleSaveResource
    deleteSave?: SimpleSaveResource
}

export interface SavesControlCallbacks {
    loadPage: (page: number) => void
    updatePages: () => void
    updateSettings: (settings: SavesPaginationSetting) => void
    deleteSave: (save: SimpleSaveResource) => void
    openInviteModal: (save: SimpleSaveResource) => void
}

class ToolHome extends Component<ToolHomeProps, ToolHomeState> {

    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;

    context!: React.ContextType<typeof FooterContext>


    private paginationLoader: PaginationLoader<SimpleSaveResource>;
    private savesControlCallbacks: SavesControlCallbacks;

    constructor(props: ToolHomeProps | Readonly<ToolHomeProps>) {
        super(props);

        this.savesControlCallbacks = {
            loadPage: this.loadPage,
            updatePages: this.updatePages,
            updateSettings: this.updateSettings,
            deleteSave: this.deleteSave,
            openInviteModal: this.openInviteModal
        };

        this.paginationLoader = new PaginationLoader<SimpleSaveResource>(async (page, perPage) => {
            let userId = Session.currentUser?.getID() as number;

            return await getSaves(userId, {
                toolID: this.props.tool.getID(),
                page: page,
                ...this.state.paginationSettings
            });


        });

        this.state = {
            showDeleteModal: false,
            showTutorial: false,
            isLoadingPage: false,
            showInviteModal: null,
            paginationSettings: {
                orderDesc: true
            }
        }
    }

    componentDidMount() {
        this.context.setItem(1, {
            newTool: {
                callback: () => this.props.tool.switchPage("new"),
                title: "Neue Analyse"
            }
        });
        this.context.setItem(2, {settings: true});

        this.loadPage(0);
    }

    componentWillUnmount() {
        this.context.clearItems();
    }

    getTutorialCanvas = () => {
        return (
            <Offcanvas placement={"start"} show={this.state.showTutorial}>
                <OffcanvasHeader closeButton onClick={() => this.setState({showTutorial: false})}>
                    <Offcanvas.Title>{this.props.tool.getToolName()}</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    {this.props.info?.tutorial}
                </OffcanvasBody>
            </Offcanvas>
        );
    }

    onInfoClick = () => {
        this.setState({showTutorial: true});
    }

    render = () => {
        let title = this.props.tool.getToolName();

        return (
            <div className={"toolHome"}>
                <h4>
                    <FAE icon={this.props.tool.getToolIcon()}/> &nbsp; {title} &nbsp;

                    {(this.props.tool.hasTutorial()) && (
                        <Badge
                            bg="dark"
                            className={"description"}
                            onClick={this.onInfoClick}
                        >
                            <FAE icon={faInfoCircle}/>
                        </Badge>
                    )}
                </h4>
                <div className={"button-container mb-0 mt-2"}>
                    {isDesktop() && (
                        <Button onClick={this.onNewSaveButtonClick} size={"sm"} variant={"dark"}>
                            <FAE icon={faPlusSquare}/> Neue Analyse
                        </Button>
                    )}


                    <span className={"sorting-button"}>
                        <span>
                            {isDesktop() && (
                                <>
                                    Nach Erstelldatum sortieren:
                                </>
                            )}
                        </span>
                        <Button type={"button"} disabled={this.state.isLoadingPage || this.state.saves === undefined}
                                className={"btn btn-primary"}
                                onClick={this.orderingChangedCallback}>
                            <FAE
                                icon={this.state.paginationSettings.orderDesc ? faSortAmountDown : faSortAmountUp}/>
                        </Button>
                    </span>
                </div>

                {this.props.info?.shortDescription}

                <hr/>

                <div className={"saves mt-2"}>
                    <SaveResourceList tool={this.props.tool!} saves={this.state.saves}
                                      savesControlCallbacks={this.savesControlCallbacks}
                                      paginationSettings={this.state.paginationSettings}
                                      pageIsLoading={this.state.isLoadingPage}/>
                </div>

                {this.props.children}

                {(this.state.showTutorial && this.props.tool?.hasTutorial()) && this.getTutorialCanvas()}

                <DeleteSaveModal
                    show={this.state.showDeleteModal}
                    save={this.state.deleteSave ?? null}
                    onClose={this.onCloseDeleteModal}
                    onDelete={this.onDeleteModal}
                />

                <SaveInvitation
                    show={this.state.showInviteModal !== null}
                    save={this.state.showInviteModal}
                    onClose={this.closeInviteModal}
                />
            </div>
        );
    }

    private onCloseDeleteModal = () => {
        this.setState({
            showDeleteModal: false,
            deleteSave: undefined
        });
    };

    private onDeleteModal = async (id: number) => {
        await deleteSave(id);
        this.setState({
            showDeleteModal: false,
            deleteSave: undefined
        }, () => {
            this.updatePages();
        });
    }

    private onNewSaveButtonClick = () => {
        this.props.tool.switchPage("new")
    }


    private loadPage = async (page: number) => {
        this.setState({
            isLoadingPage: true
        });
        await this.paginationLoader.loadPage(page);
        this.updateSavesState();
        this.setState({
            isLoadingPage: false
        });
    }

    private updatePages = async () => {
        this.setState({
            saves: undefined
        });
        this.paginationLoader.clearCache();
        await this.paginationLoader.loadPage(0);
        this.updateSavesState();

    }

    private updateSavesState = () => {
        this.setState({
            saves: this.paginationLoader.getAllLoaded()
        });
    }

    private updateSettings = (settings: SavesPaginationSetting) => {
        this.setState({
            paginationSettings: settings
        }, () => {
            this.updatePages();
        });
    }

    private orderingChangedCallback = () => {
        this.updateSettings({
            ...this.state.paginationSettings,
            orderDesc: !this.state.paginationSettings.orderDesc,
        });
    }

    private openInviteModal = async (save: SimpleSaveResource) => {
        this.setState({
            showInviteModal: save,
        });
    }

    private closeInviteModal = async () => {
        this.setState({
            showInviteModal: null
        });
    }

    private deleteSave = async (save: SimpleSaveResource) => {
        this.setState({
            showDeleteModal: true,
            deleteSave: save
        });
    }
}

export {
    ToolHome
}
