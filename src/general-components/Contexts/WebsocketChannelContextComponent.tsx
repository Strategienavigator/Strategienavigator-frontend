import {Component, createContext} from "react";
import {Channel} from "laravel-echo/src/channel/channel";
import Echo, {PresenceChannel} from "laravel-echo";
import {SimplestUserResource} from "../Datastructures";


export interface IWebsocketChannelContext<D extends Channel> {
    connection: Echo | null,
    channel: D | null,
}

export interface WebsocketChannelContextProps<D extends Channel> {
    connection: Echo | null,
    channel: D | null,
}

export interface WebsocketChannelContextState<D extends Channel> {
    socketContext: IWebsocketChannelContext<D>
}

export const WebsocketChannelContext = createContext<IWebsocketChannelContext<any>>({
    connection: null,
    channel: null,
});

export class WebsocketChannelContextComponent<D extends Channel> extends Component<WebsocketChannelContextProps<D>, WebsocketChannelContextState<D>> {

    constructor(props: any) {
        super(props);

        this.state = {
            socketContext: {
                connection: null,
                channel: null,
            }
        }
    }

    static getDerivedStateFromProps(props: WebsocketChannelContextProps<any>, state: WebsocketChannelContextState<any>): WebsocketChannelContextState<any> {
        return {
            socketContext: {
                channel: props.channel,
                connection: props.connection
            }
        }
    }

    render() {
        return (
            <WebsocketChannelContext.Provider value={this.state.socketContext}>
                {this.props.children}
            </WebsocketChannelContext.Provider>
        );
    }

}
