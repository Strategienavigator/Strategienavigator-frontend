import React, {Component, ReactNode} from "react";
import {Tool} from "../Tool";
import {Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {setControlFooterItem} from "../../ControlFooter/ControlFooter";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {SavePagination} from "./SavePagination/SavePagination";

import "./tool-home.scss";


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

    constructor(props: ToolHomeProps | Readonly<ToolHomeProps>) {
        super(props);

        this.state = {
            showTutorial: false,
        }
    }

    componentDidMount() {
        setControlFooterItem(1, {
            newTool: {
                callback: () => this.props.tool?.switchPage("new"),
                title: "Neue Analyse"
            }
        });
        setControlFooterItem(2, {settings: true});
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

                <hr/>

                {this.props.info?.shortDescription}

                <div className={"mt-4"}>
                    {isDesktop() && (
                        <Button onClick={() => this.props.tool?.switchPage("new")} size={"sm"} variant={"dark"}>
                            <FontAwesomeIcon icon={faPlusSquare}/> Neue Analyse
                        </Button>
                    )}
                </div>

                <div className={"saves mt-2"}>
                    <SavePagination tool={this.props.tool!}/>
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
