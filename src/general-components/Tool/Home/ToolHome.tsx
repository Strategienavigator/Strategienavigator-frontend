import React, {Component, ReactNode} from "react";
import {Tool} from "../Tool";
import {Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {SavePagination} from "./SaveResourceList/SavePagination/SavePagination";

import "./tool-home.scss";
import {SaveInfinityScroll} from "./SaveResourceList/SaveInfinityScroll/SaveInfinityScroll";
import {FooterContext} from "../../Contexts/FooterContextComponent";
import {SaveResourceList} from "./SaveResourceList/SaveResourceList";
import {PaginationPage} from "../../API/PaginationLoader";
import {SimpleSaveResource} from "../../Datastructures";


export interface ToolHomeInfo {
    shortDescription?: ReactNode
    tutorial?: ReactNode
}

export interface ToolHomeProps {
    tool?: Tool
    info?: ToolHomeInfo
}

interface ToolHomeState {
    showTutorial: boolean
}

class ToolHome extends Component<ToolHomeProps, ToolHomeState> {

    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>
    constructor(props: ToolHomeProps | Readonly<ToolHomeProps>) {
        super(props);

        this.state = {
            showTutorial: false,
        }
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
                    <SaveResourceList tool={this.props.tool!}/>
                </div>

                {this.props.children}

                {(this.state.showTutorial && this.props.tool?.hasTutorial()) && this.getTutorialCanvas()}
            </div>
        );
    }

}

export {
    ToolHome
}
