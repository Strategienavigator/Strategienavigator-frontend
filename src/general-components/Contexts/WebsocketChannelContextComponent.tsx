import {Component, createContext} from "react";
import Echo, {PresenceChannel} from "laravel-echo";
import {SimplestUserResource} from "../Datastructures";


export interface IWebsocketChannelContext {
    connection: Echo | null,
    channel: PresenceChannel | null,
    collaborators: SimplestUserResource[]
}

export interface WebsocketChannelContextProps {
    connection: Echo | null,
    channel: PresenceChannel | null,
}

export interface WebsocketChannelContextState {
    socketContext: IWebsocketChannelContext,
    registeredHere: boolean,
    registeredJoin: boolean,
    registeredLeave: boolean
}

export const WebsocketChannelContext = createContext<IWebsocketChannelContext>({
    connection: null,
    channel: null,
    collaborators: []
});

export class WebsocketChannelContextComponent extends Component<WebsocketChannelContextProps, WebsocketChannelContextState> {

    constructor(props: any) {
        super(props);

        this.state = {
            socketContext: {
                connection: null,
                channel: null,
                collaborators: []
            },
            registeredHere: false,
            registeredJoin: false,
            registeredLeave: false
        }
    }

    static getDerivedStateFromProps(props: WebsocketChannelContextProps, state: WebsocketChannelContextState): WebsocketChannelContextState | null {
        if (
            state.socketContext.channel !== props.channel ||
            state.socketContext.connection !== props.connection
        ) {
            return {
                socketContext: {
                    channel: props.channel,
                    connection: props.connection,
                    collaborators: []
                },
                registeredHere: false,
                registeredJoin: false,
                registeredLeave: false
            }
        }
        return null;
    }

    render() {
        return (
            <WebsocketChannelContext.Provider value={this.state.socketContext}>
                {this.props.children}
            </WebsocketChannelContext.Provider>
        );
    }

    componentDidMount() {
        this.registerListener();
    }

    private registerListener() {
        let channel = this.state.socketContext.channel;
        let [here, join, leave] = Array(3).fill(false);

        if (channel) {
            /**
             * HERE
             */
            if (!this.state.registeredHere) {
                channel.here((users: SimplestUserResource[]) => {
                    console.log("Current collaborators:", users.map((u) => u.username));
                    this.setState({
                        socketContext: {
                            ...this.state.socketContext,
                            collaborators: users
                        }
                    });
                });
                here = true;
            }

            /**
             * JOINING
             */
            if (!this.state.registeredJoin) {
                channel.joining((user: SimplestUserResource) => {
                    console.log("Collaborator joined:", user.username);

                    this.setState((state) => {
                        const collaborators = state.socketContext.collaborators.concat(user);
                        return {
                            socketContext: {
                                ...state.socketContext,
                                collaborators: collaborators
                            }
                        };
                    });
                });
                join = true;
            }

            /**
             * LEAVING
             */
            if (!this.state.registeredLeave) {
                channel.leaving((user: SimplestUserResource) => {
                    console.log("Collaborator left:", user.username);

                    this.setState(function (state) {
                        let index = state.socketContext.collaborators.indexOf(user);
                        const collaborators = state.socketContext.collaborators.filter((item, j) => index !== j);
                        return {
                            socketContext: {
                                ...state.socketContext,
                                collaborators: collaborators
                            }
                        };
                    });
                });
                leave = true;
            }

            this.setState({
                registeredLeave: leave,
                registeredHere: here,
                registeredJoin: join
            });
        }
    }

}
