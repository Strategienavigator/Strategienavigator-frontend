import React, {Component} from "react";

import './save-card.scss';
import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {SimpleSaveResource} from "../../../Datastructures";


export interface SaveCardProps {
    save: SimpleSaveResource
    toolLink: string
    onTrash?: () => void
}

export class SaveCard extends Component<SaveCardProps, {}> {


    render() {
        return (
            <div key={this.props.save.id} className={"save"}>
                <Card as={Link} to={this.props.toolLink + "/" + this.props.save.id}
                      className={"mt-2 mb-2 save-card"}>
                    <Card.Body className={"save-body"}>
                        <Card.Title>{this.props.save.name}</Card.Title>
                        <Card.Text
                            className={"save-desc text-muted mb-1"}>{this.props.save.description ? this.props.save.description : "Keine Beschreibung vorhanden"}</Card.Text>
                    </Card.Body>
                </Card>
                {!!this.props.onTrash && (
                    <Button type={"button"} variant={"danger"} className={"deleteSave"} onClick={this.props.onTrash}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </Button>
                )}

            </div>
        );
    }
}
