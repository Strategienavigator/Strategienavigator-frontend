import React, {Component} from "react";

import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {SimpleSaveResource} from "../../../Datastructures";
import FAE from "../../../Icons/FAE";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons/";
import {SharedSaveContext} from "../../../Contexts/SharedSaveContextComponent";

import './save-card.scss';
import {DeleteSavePermission, hasPermission, InviteToSavePermission} from "../../../Permissions";
import {ButtonPanel} from "../../../ButtonPanel/ButtonPanel";
import {useIsDesktop} from "../../../Contexts/DesktopContext";


export interface SaveCardProps {
    save?: SimpleSaveResource
    toolLink?: string
    onTrash?: () => void
    onInvite?: (save: SimpleSaveResource) => void
}

export function SaveCard({save, onTrash, onInvite, toolLink}: SaveCardProps) {
    const isDesktop = useIsDesktop();
    if (save !== undefined && toolLink !== undefined) {
        // EARLY RETURN
        let isDeleting = save.owner_deleting;

        let classes = ["save"];
        if (isDeleting)
            classes.push("disabled");

        let formattedCreatedDate = new Date(save.created_at).toLocaleDateString("de-DE");

        return (
            <SharedSaveContext.Consumer>
                {(context) => (
                    <div key={save!.id} className={classes.join(" ")}>
                        <Card as={Link} to={toolLink + "/" + save!.id}
                              className={"mt-2 mb-2 save-card"}>
                            <Card.Body className={"save-body"}>
                                <Card.Title>{save!.name}</Card.Title>
                                <Card.Text
                                    className={"save-desc text-muted mb-1"}
                                >
                                    {save!.description && save!.description}
                                </Card.Text>
                                <small
                                    title={"Erstelldatum: " + formattedCreatedDate}
                                    className={`created-date text-muted ${isDesktop && "desktop"}`}
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
                                            if (onInvite !== undefined && save !== undefined) {
                                                onInvite(save);
                                            }
                                        }}>
                                    <FAE icon={faUserPlus}/>
                                </Button>
                            )}
                            {/* {( isPersona ) && (
                                    <Link to={{
                                        pathname :"persona/" + save!.id,
                                        state : saveToSend
                                        }}>
                                    <Button  variant={"danger"} className={"personaPdf"} >
                                        <FAE icon={faUser}/>
                                    </Button>
                                    </Link>
                                )} */}
                            {(hasPermission(context.permission, DeleteSavePermission) && !!onTrash && !isDeleting) && (
                                <Button type={"button"} variant={"danger"} className={"deleteSave"}
                                        onClick={onTrash}>
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
    );

}
