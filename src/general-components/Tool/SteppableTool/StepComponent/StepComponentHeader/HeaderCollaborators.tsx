import React, {Component} from "react";
import {CollaboratorsDotsComponent} from "../../../../CollaboratorsComponent/CollaboratorsDotsComponent";
import {SimpleSaveResource} from "../../../../Datastructures";
import {WebsocketChannelContext} from "../../../../Contexts/WebsocketChannelContextComponent";


export interface HeaderCollaboratorsProps {
    save: SimpleSaveResource
}

export class HeaderCollaborators extends Component<HeaderCollaboratorsProps, any> {
    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = WebsocketChannelContext;
    context!: React.ContextType<typeof WebsocketChannelContext>

    render = () => {
        return (
            <CollaboratorsDotsComponent
                collaborators={this.context.collaborators}
            />
        );
    }

}