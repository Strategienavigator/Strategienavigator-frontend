import React, {Component} from "react";
import {isDesktop} from "../../Desktop";
import FixedFooter from "../../FixedFooter/FixedFooter";
import {Button, ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import Loader from "../../Loader/Loader";
import {Session} from "../../Session/Session";
import {getSaves} from "../../APICalls";
import {Save} from "../../Datastructures";

export interface ToolFrontpageProps {
    tool: number
    link: string
}

interface ToolFrontpageState {
    saves: Array<any>
}

class ToolFrontpage<P> extends Component<ToolFrontpageProps & P, ToolFrontpageState> {

    constructor(props: (ToolFrontpageProps & P) | Readonly<ToolFrontpageProps & P>) {
        super(props);

        this.state = {
            saves: []
        };
    }

    loadToolSaves = async () => {
        if (Session.isLoggedIn()) {
            let userID = Session.currentUser?.getID() as number;

            let call = await getSaves(userID, Session.getToken());
            if (call.success) {
                let saves = call.callData.data;
                this.setState({
                    saves: saves
                })
            }
        }
    }

    render = () => {
        return (
            <div className={"container"}>
                {this.props.children}

                <Loader text={"Lade Speicherstände..."} alignment={"left"} size={50} transparent animate={false}
                        payload={[this.loadToolSaves]}>
                    <ListGroup className={"saves mt-3"}>

                        {this.state.saves?.length <= 0 && (
                            <ListGroupItem>Sie haben aktuell keine Speicherstände.</ListGroupItem>
                        )}

                        {this.state.saves?.map(value => {
                            let save = value as Save;
                            if (save.tool_id === this.props.tool) {
                                return (
                                    <ListGroupItem as={Link} to={this.props.link + "/" + save.id} key={save.id} action>
                                        {save.name}
                                    </ListGroupItem>
                                );
                            }
                            return null;
                        })}

                    </ListGroup>
                </Loader>

                <div className={"mt-4"}>
                    {isDesktop() && (
                        <Link to={this.props.link + "/new"}>
                            <Button size={"sm"} variant={"dark"}>
                                <FontAwesomeIcon icon={faPlusSquare}/> Neue Analyse
                            </Button>
                        </Link>
                    )}

                    {!isDesktop() && (
                        <FixedFooter home settings
                                     newTool={{link: this.props.link + "/new", title: "Neue Analyse"}}/>
                    )}
                </div>
            </div>
        );
    }
}

export default ToolFrontpage;