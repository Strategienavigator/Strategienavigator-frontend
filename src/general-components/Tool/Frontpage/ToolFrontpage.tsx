import React, {Component} from "react";
import {isDesktop} from "../../Desktop";
import {clearControlFooter, setControlFooterItem} from "../../ControlFooter/ControlFooter";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {Loader} from "../../Loader/Loader";
import {Session} from "../../Session/Session";
import {getSaves} from "../../API/calls/Saves";
import {SimpleSaveResource} from "../../Datastructures";

export interface ToolFrontpageProps {
    tool: number
    link: string
    maintenance?: boolean
}

export interface ToolFrontpageState {
    saves: Array<any>
}

export class ToolFrontpage<P> extends Component<ToolFrontpageProps & P, ToolFrontpageState> {

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

    componentDidMount() {
        if (this.props.maintenance) {
            setControlFooterItem(2, {home: true});
        } else {
            setControlFooterItem(1, {newTool: {link: this.props.link + "/new", title: "Neue Analyse"}});
            setControlFooterItem(2, {settings: true});
        }
    }

    componentWillUnmount() {
        clearControlFooter();
    }

    render = () => {
        if (this.props.maintenance) {
            return (
                <Card body>
                    Diese Analyse ist in Bearbeitung...
                </Card>
            );
        }

        return (
            <div className={"container"}>
                {this.props.children}

                <Loader alignment={"left"} size={50} transparent animate={false}
                        payload={[this.loadToolSaves]}>
                    <ListGroup className={"saves mt-2"}>

                        {this.state.saves?.length <= 0 && (
                            <ListGroupItem>Sie haben aktuell keine Speicherstände.</ListGroupItem>
                        )}

                        {this.state.saves?.map(value => {
                            let save = value as SimpleSaveResource;
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
                </div>
            </div>
        );
    }

}
