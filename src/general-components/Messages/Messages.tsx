import {Component, ReactElement, ReactNode, CSSProperties} from "react";
import {reload_app} from "../../index";
import {Alert} from "react-bootstrap";

import "./messages.scss";

export type MessageTypes = "WARNING" | "DANGER" | "INFO" | "SUCCESS";
export type xAlignments = "CENTER" | "LEFT" | "RIGHT";
export type yAlignments = "MIDDLE" | "TOP" | "BOTTOM";

interface MessagesProps {
    xAlignment: xAlignments
    yAlignment: yAlignments
    style?: CSSProperties
}

interface SingleMessageProps {
    content: ReactNode
    type: MessageTypes
    timer?: number
}

interface SingleMessageState {
    show: boolean
}

class SingleMessage extends Component<SingleMessageProps, SingleMessageState> {

    constructor(props: SingleMessageProps | Readonly<SingleMessageProps>) {
        super(props);

        this.state = {
            show: true
        }
    }

    componentDidMount() {
        if (this.props.timer !== undefined) {
            setTimeout(() => this.setState({show: false}), this.props.timer);
        }
    }

    render = () => {
        return (
            <Alert show={this.state.show} className={"message"} onClose={() => this.setState({show: false})} dismissible
                   variant={this.props.type.toLowerCase()}>
                {this.props.content}
            </Alert>
        );
    }

}

class Messages extends Component<MessagesProps, any> {
    public static TIMER: number = 3000;
    public static messages: Array<ReactElement> = new Array<ReactElement>();

    static add(content: ReactNode, type: MessageTypes, timer?: number) {
        Messages.messages.push(<SingleMessage key={Messages.messages.length} content={content} type={type}
                                              timer={timer}/>);
        reload_app();
    }

    render = () => {
        return (
            <div
                className={["messagesContainer", this.props.yAlignment.toLowerCase(), this.props.xAlignment.toLowerCase()].join(" ")}>
                <div style={this.props.style} className={"messages"}>
                    {Messages.messages}
                </div>
            </div>
        );
    }

}

export {
    Messages
}