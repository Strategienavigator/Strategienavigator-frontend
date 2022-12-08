import React, {PureComponent} from "react";
import {Tool} from "../../../Tool";
import {isDesktop} from "../../../../Desktop";
import {Button, Collapse, Form} from "react-bootstrap";

import "./step-header.scss";
import {SharedSaveContext} from "../../../../Contexts/SharedSaveContextComponent";
import {EditSavesPermission, hasPermission, InviteToSavePermission} from "../../../../Permissions";
import {SaveResource, SharedSavePermission} from "../../../../Datastructures";
import FAE from "../../../../Icons/FAE";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {SaveInvitation} from "../../../../Sharing/SaveInvitation";
import {HeaderCollaborators} from "./HeaderCollaborators";
import {CreateToolModal} from "../../../CreateToolModal/CreateToolModal";
import {UserContext} from "../../../../Contexts/UserContextComponent";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons/";
import {lockSave} from "../../../../API/calls/Saves";


export interface StepComponentHeaderProp {
    tool: Tool<any>
    associatedSave: SaveResource<any>
    saveName: string
    saveDescription: string
    saveMetaChanged: (name: string, description: string) => void
}

export interface StepComponentHeaderState {
    showStepHeaderDesc: boolean,
    showInviteModal: boolean,
    descriptionTooLong: boolean
}

export class StepComponentHeader extends PureComponent<StepComponentHeaderProp, StepComponentHeaderState> {
    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = SharedSaveContext;
    context!: React.ContextType<typeof SharedSaveContext>

    constructor(props: StepComponentHeaderProp, context: any) {
        super(props, context);
        this.state = {
            showStepHeaderDesc: isDesktop(),
            showInviteModal: false,
            descriptionTooLong: false
        }
    }

    render() {
        return (
            <div className={"stepHeaderContainer"}>
                <UserContext.Consumer>
                    {(userContext) => {
                        return hasPermission(this.context.permission, [SharedSavePermission.READ]) &&
                            this.props.associatedSave.owner.id === userContext.user?.getID() && (
                                <Button type={"button"} variant={"success"} className={"reclaimEditor"}
                                        onClick={this.lockSave}>
                                    <FAE icon={faPencilAlt}/> Bearbeiter werden
                                </Button>
                            );
                    }}
                </UserContext.Consumer>
                <div className={"toolName"}>


                    {this.props.tool.getToolName()}

                    {hasPermission(this.context.permission, InviteToSavePermission) && (
                        <Button type={"button"} variant={"primary"} className={"inviteSave"}
                                onClick={() => {
                                    this.setState({
                                        showInviteModal: true
                                    });
                                }}
                        >
                            <FAE icon={faUserPlus}/>
                        </Button>
                    )}
                </div>
                <div className={"stepHeader form"}>
                    <Form.Control
                        type={"text"}
                        value={this.props.saveName}
                        onChange={this.onChangeCurrentName}
                        onFocus={this.showDescription}
                        onBlur={this.showDescriptionIfDesktop}
                        disabled={!hasPermission(this.context.permission, EditSavesPermission)}
                    />

                    <Collapse in={this.state.showStepHeaderDesc}>
                        <div>
                            <Form.Control
                                type={"textarea"}
                                as={"textarea"}
                                onFocus={this.showDescription}
                                onBlur={this.showDescriptionIfDesktop}
                                value={this.props.saveDescription}
                                onChange={this.onChangeCurrentDescription}
                                disabled={!hasPermission(this.context.permission, EditSavesPermission)}
                            />
                            {this.state.descriptionTooLong && (
                                <div className={"feedbackContainer"}>
                                    <div className={"feedback DANGER"}>
                                        Beschreibung darf maximal {CreateToolModal.MAX_LENGTH_DESC} Zeichen lang sein.
                                    </div>
                                </div>
                            )}
                        </div>
                    </Collapse>
                </div>

                <SharedSaveContext.Consumer>
                    {(context) => {
                        return (
                            <SaveInvitation
                                show={this.state.showInviteModal}
                                save={this.props.associatedSave}
                                onClose={() => {
                                    this.setState({
                                        showInviteModal: false
                                    });
                                }}
                            />
                        );
                    }}
                </SharedSaveContext.Consumer>

                <HeaderCollaborators
                    save={this.props.associatedSave}
                />
            </div>
        );
    }

    onChangeCurrentName = (e: { currentTarget: { value: string; }; }) => {
        const name = e.currentTarget.value;
        this.props.saveMetaChanged(name, this.props.saveDescription);
    }

    onChangeCurrentDescription = (e: { currentTarget: { value: string; }; }) => {
        const description = e.currentTarget.value;
        this.setState({
            descriptionTooLong: description.length > CreateToolModal.MAX_LENGTH_DESC
        });
        this.props.saveMetaChanged(this.props.saveName, description);
    }

    private showDescription = () => {
        this.setState({
            showStepHeaderDesc: true
        });
    }

    private showDescriptionIfDesktop = () => {
        this.setState({
            showStepHeaderDesc: isDesktop()
        });
    }

    private lockSave = async () => {

        let response = await lockSave(this.props.associatedSave.id, true);

        if (response?.success === true) {
            this.context.updatePermission(SharedSavePermission.OWNER);
        }
    }
}
