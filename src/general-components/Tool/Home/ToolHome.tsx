import React, {Component, ReactNode} from "react";
import {Tool} from "../Tool";
import {Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

import "./tool-home.scss";
import {FooterContext} from "../../Contexts/FooterContextComponent";
import {SaveResourceList} from "./SaveResourceList/SaveResourceList";
import {PaginationLoader, PaginationPages} from "../../API/PaginationLoader";
import {SimpleSaveResource} from "../../Datastructures";
import {Session} from "../../Session/Session";
import {getSaves} from "../../API/calls/Saves";


export interface ToolHomeInfo {
    shortDescription?: ReactNode
    tutorial?: ReactNode
}

export interface ToolHomeProps {
    tool?: Tool
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
}

export interface SavesControlCallbacks {
    loadPage: (page: number) => void
    updatePages: () => void
    updateSettings: (settings: SavesPaginationSetting) => void

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
            updateSettings: this.updateSettings
        };

        this.paginationLoader = new PaginationLoader<SimpleSaveResource>(async (page, perPage) => {
            let userId = Session.currentUser?.getID() as number;
            if (this.props.tool !== undefined) {
                return await getSaves(userId, {
                    toolID: this.props.tool.getID(),
                    page: page,
                    ...this.state.paginationSettings
                });
            } else {
                return null;
            }

        });

        this.state = {
            showTutorial: false,
            isLoadingPage:false,
            paginationSettings: {
                orderDesc: true
            }
        }

        this.loadPage(0);
    }

    componentDidMount() {
        this.context.setItem(1, {
            newTool: {
                callback: () => this.props.tool?.switchPage("new"),
                title: "Neue Analyse"
            }
        });
        this.context.setItem(2, {settings: true});
    }

    getTutorialCanvas = () => {
        return (
            <Offcanvas placement={"start"} show={this.state.showTutorial}>
                <OffcanvasHeader closeButton onClick={() => this.setState({showTutorial: false})}>
                    <Offcanvas.Title>{this.props.tool?.getToolName()}</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    {this.props.info?.tutorial}
                </OffcanvasBody>
            </Offcanvas>
        );
    }

    render = () => {
        let title = this.props.tool?.getToolName();

        return (
            <div className={"toolHome"}>
                <h4>
                    <FontAwesomeIcon icon={this.props.tool?.getToolIcon() as IconDefinition}/> &nbsp; {title} &nbsp;

                    {(this.props.tool?.hasTutorial()) && (
                        <Badge
                            bg="dark"
                            className={"description"}
                            onClick={() => this.setState({showTutorial: true})}
                        >
                            <FontAwesomeIcon icon={faInfoCircle}/>
                        </Badge>
                    )}
                </h4>
                <div className={"mb-0 mt-2"}>
                    {isDesktop() && (
                        <Button onClick={() => this.props.tool?.switchPage("new")} size={"sm"} variant={"dark"}>
                            <FontAwesomeIcon icon={faPlusSquare}/> Neue Analyse
                        </Button>
                    )}
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
            </div>
        );
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
}

export {
    ToolHome
}
