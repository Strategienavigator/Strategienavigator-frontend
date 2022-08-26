import {Component} from "react";
import {CollaboratorsDotsComponent} from "../../../../CollaboratorsComponent/CollaboratorsDotsComponent";
import {SimpleSaveResource, SimplestUserResource} from "../../../../Datastructures";
import {IWebsocketChannelContext} from "../../../../Contexts/WebsocketChannelContextComponent";
import {PresenceChannel} from "laravel-echo";


export interface HeaderCollaboratorsProps {
    save: SimpleSaveResource,
    wsContext: IWebsocketChannelContext<PresenceChannel>
}

interface HeaderCollaboratorsState {
    collaborators: SimplestUserResource[]
}

export class HeaderCollaborators extends Component<HeaderCollaboratorsProps, HeaderCollaboratorsState> {
    state: HeaderCollaboratorsState = {
        collaborators: []
    }

    render = () => {
        return (
          <CollaboratorsDotsComponent
            collaborators={this.state.collaborators}
          />
        );
    }

    componentDidMount() {
        let channel = this.props.wsContext.channel;

        if (channel) {
            /**
             * HERE
             */
            channel.here((users: SimplestUserResource[]) => {
                console.log("Current collaborators:", users.map((u) => u.username));
                this.setState({
                    collaborators: users
                });
            });

            /**
             * JOINING
             */
            channel.joining((user: SimplestUserResource) => {
                console.log("Collaborator joined:", user.username);

                this.setState((state) => {
                    const collaborators = state.collaborators.concat(user);
                    return {
                        collaborators
                    };
                });
            });
            /**
             * LEAVING
             */
            channel.leaving((user: SimplestUserResource) => {
                console.log("Collaborator left:", user.username);

                this.setState(function (state) {
                    let index = state.collaborators.indexOf(user);
                    const collaborators = state.collaborators.filter((item, j) => index !== j);
                    return {
                        collaborators
                    };
                });
            });
        }
    }

}