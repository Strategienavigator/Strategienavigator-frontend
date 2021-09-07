import React, {Component, ReactNode} from "react";
import {Tool} from "../Tool";
import {Badge, Button, ListGroup, ListGroupItem, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../Desktop";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../../Loader/Loader";
import {SimpleSaveResource} from "../../Datastructures";
import {Link} from "react-router-dom";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {Session} from "../../Session/Session";
import {getSaves} from "../../API/calls/Saves";
import {setControlFooterItem} from "../../ControlFooter/ControlFooter";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

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
    saves: Array<any>
    showTutorial: boolean
}

class ToolHome extends Component<ToolHomeProps, ToolHomeState> {

    constructor(props: ToolHomeProps | Readonly<ToolHomeProps>) {
        super(props);

        this.state = {
            saves: [],
            showTutorial: false,
        }
    }

    loadToolSaves = async () => {
        if (Session.isLoggedIn()) {
            let userID = Session.currentUser?.getID() as number;

            let call = await getSaves(userID, Session.getToken(), this.props.tool?.getID());
            if (call.success) {
                let saves = call.callData.data;
                this.setState({
                    saves: saves
                })
            }
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

                <div className={"saves mt-2"}>
                    <Loader alignment={"left"} size={50} transparent animate={false}
                            payload={[this.loadToolSaves]}>
                        <ListGroup>
                            {this.state.saves?.length <= 0 && (
                                <ListGroupItem>Sie haben aktuell keine Speicherstände.</ListGroupItem>
                            )}

                            {this.state.saves?.map(value => {
                                let save = value as SimpleSaveResource;
                                return (
                                    <ListGroupItem as={Link} to={this.props.tool?.getLink() + "/" + save.id}
                                                   key={save.id}
                                                   action>
                                        {save.name}
                                    </ListGroupItem>
                                );
                            })}

                        </ListGroup>
                    </Loader>
                </div>

                {this.props.children}

                <div className={"mt-4"}>
                    {isDesktop() && (
                        <Button onClick={() => this.props.tool?.switchPage("new")} size={"sm"} variant={"dark"}>
                            <FontAwesomeIcon icon={faPlusSquare}/> Neue Analyse
                        </Button>
                    )}
                </div>

                {(this.state.showTutorial && this.props.tool?.hasTutorial()) && this.getTutorialCanvas()}
            </div>
        );
    }

}

export {
    ToolHome
}