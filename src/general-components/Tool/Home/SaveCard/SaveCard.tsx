import React, {Component} from "react";

import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {SimpleSaveResource} from "../../../Datastructures";
import FAE from "../../../Icons/FAE";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons/";
import {SharedSaveContext} from "../../../Contexts/SharedSaveContextComponent";

import './save-card.scss';
import {DeleteSavePermission, hasPermission, InviteToSavePermission} from "../../../Permissions";
import {ButtonPanel} from "../../../ButtonPanel/ButtonPanel";
import {isDesktop} from "../../../Desktop";


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

            let tool_id = this.props.save.tool_id;
            let isPersona = (tool_id ===5)
            let saveToSend = this.props.save
            
            
            let formattedCreatedDate = new Date(this.props.save.created_at).toLocaleDateString("de-DE");

            return (
                <SharedSaveContext.Consumer>
                    {(context) => (
                        <div key={this.props.save!.id} className={classes.join(" ")}>
                            <Card as={Link} to={this.props.toolLink + "/" + this.props.save!.id}
                                  className={"mt-2 mb-2 save-card"}>
                                <Card.Body className={"save-body"}>
                                    <Card.Title>{this.props.save!.name}</Card.Title>
                                    <Card.Text
                                        className={"save-desc text-muted mb-1"}
                                    >
                                        {this.props.save!.description && this.props.save!.description}
                                    </Card.Text>
                                    <small
                                        title={"Erstelldatum: " + formattedCreatedDate}
                                        className={`created-date text-muted ${isDesktop() && "desktop"}`}
                                    >
                                        {formattedCreatedDate}
                                    </small>
                                </Card.Body>
                            </Card>

                            <ButtonPanel buttonPerCol={3}>
                                {(isDeleting) && (
                                    <Button disabled variant={"danger"} className={"deleting"}>
                                        Inhaber löscht aktuell sein Konto!
                                    </Button>
                                )}
                                {(hasPermission(context.permission, InviteToSavePermission) && !isDeleting) && (
                                    <Button type={"button"} variant={"primary"} className={"inviteSave"}
                                            onClick={() => {
                                                if (this.props.onInvite !== undefined && this.props.save !== undefined) {
                                                    this.props.onInvite(this.props.save);
                                                }
                                            }}>
                                        <FAE icon={faUserPlus}/>
                                    </Button>
                                )}
                                  {( isPersona ) && (
                                    <Link to={{ 
                                        pathname :"persona/" + this.props.save!.id,
                                        state : saveToSend
                                        }}>
                                    <Button  variant={"danger"} className={"personaPdf"} >
                                        <FAE icon={faUser}/>
                                    </Button>
                                    </Link>
                                )}
                                {(hasPermission(context.permission, DeleteSavePermission) && !!this.props.onTrash && !isDeleting) && (
                                    <Button type={"button"} variant={"danger"} className={"deleteSave"}
                                            onClick={this.props.onTrash}>
                                        <FAE icon={faTrash}/>
                                    </Button>
                                )}
                              
                            </ButtonPanel>
                        </div>
                    )}
                </SharedSaveContext.Consumer>
            );
        }

        return (
            <div className={"save"}>
                <Card className={"mt-2 mb-2 save-card-dummy"}>
                    <Card.Body className={"save-body"}>
                        <Card.Title className={"dummy"}>..............................</Card.Title>
                        <br/>
                        <Card.Text className={"save-desc mb-1 dummy"}>
                            ......................................................
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
   
    onPersona = (save: number) =>  {
        return (e : any)=>{
            console.log(e);
            
            console.log(save);
        }
    }
}
