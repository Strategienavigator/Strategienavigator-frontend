import React, {Component} from "react";

import './save-card.scss';
import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {SimpleSaveResource} from "../../../Datastructures";
import FAE from "../../../Icons/FAE";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons/";


export interface SaveCardProps {
    save?: SimpleSaveResource
    toolLink?: string
    onTrash?: () => void
    onInvite?: (save: SimpleSaveResource) => void
}

export class SaveCard extends Component<SaveCardProps, {}> {

    render() {
        if (this.props.save !== undefined && this.props.toolLink !== undefined) {
            // EARLY RETURN
            let isDeleting = this.props.save.owner_deleting;

            let classes = ["save"];
            if (isDeleting)
                classes.push("disabled");

            return (
                <div key={this.props.save.id} className={classes.join(" ")}>
                    <Card as={Link} to={this.props.toolLink + "/" + this.props.save.id}
                          className={"mt-2 mb-2 save-card"}>
                        <Card.Body className={"save-body"}>
                            <Card.Title>{this.props.save.name}</Card.Title>
                            <Card.Text
                                className={"save-desc text-muted mb-1"}>{this.props.save.description ? this.props.save.description : "Keine Beschreibung vorhanden"}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Button type={"button"} variant={"primary"} className={"inviteSave"}
                            onClick={() => {
                                if (this.props.onInvite !== undefined && this.props.save !== undefined) {
                                    this.props.onInvite(this.props.save);
                                }
                            }}>
                        <FAE icon={faUserPlus}/>
                    </Button>

                    {(!!this.props.onTrash && !isDeleting) && (
                        <Button type={"button"} variant={"danger"} className={"deleteSave"}
                                onClick={this.props.onTrash}>
                            <FAE icon={faTrash}/>
                        </Button>
                    )}
                    {(isDeleting) && (
                        <span className={"deleting"}>
                            Inhaber löscht aktuell sein Konto!
                        </span>
                    )}
                </div>
            );
        }

        return (
            <div className={"save"}>
                <Card className={"mt-2 mb-2 save-card-dummy"}>
                    <Card.Body className={"save-body"}>
                        <Card.Title className={"dummy"}>Dummy title which is long</Card.Title> <br/>
                        <Card.Text
                            className={"save-desc mb-1 dummy"}>eine relativ lange beschreibung die nicht zu lang
                            ist</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
