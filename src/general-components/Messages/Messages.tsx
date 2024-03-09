import React, {
    createContext,
    CSSProperties,
    ReactElement,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState
} from "react";
import {Alert} from "react-bootstrap";

import "./messages.scss";


export type MessageTypes = "WARNING" | "DANGER" | "INFO" | "SUCCESS";
export type xAlignments = "CENTER" | "LEFT" | "RIGHT";
export type yAlignments = "MIDDLE" | "TOP" | "BOTTOM";

export interface MessagesProps {
    children: ReactNode
    xAlignment: xAlignments
    yAlignment: yAlignments
    style?: CSSProperties
}

export interface SingleMessageProps {
    /**
     * Inhalt der angezeigt wird.
     */
    content: ReactNode
    /**
     * Inhalt der angezeigt wird.
     */
    type: MessageTypes
    /**
     * Zeit in millisekunden nachdem die message verschwindet.
     */
    timer?: number
}

export interface SingleMessageState {
    show: boolean
}

export interface IMessageContext {
    add: (content: ReactNode, type: MessageTypes, timer?: number) => any
    addWithProps: (values: SingleMessageProps) => any
}

export const MessageContext = createContext({
    add: (content: ReactNode, type: MessageTypes, timer?: number) => {
        console.warn("Tried to add message while the context wasn't initialized!")
    },
    addWithProps: (values: SingleMessageProps) => {
        console.warn("Tried to add message while the context wasn't initialized!")
    }
} as IMessageContext)


function SingleMessage({content, type, timer}: SingleMessageProps) {

    const [show, setShow] = useState(true);

    useEffect(() => {
        if (timer === undefined) {
            return;
        }
        const timeout = setTimeout(() => setShow(false), timer);

        return () => {
            clearTimeout(timeout)
        }
    }, [setShow, timer])

    return (
        <Alert show={show} className={"message"} onClose={() => setShow(false)} dismissible
               variant={type.toLowerCase()}>
            {content}
        </Alert>
    );

}


/**
 * This functions appends a SingleMessage element to the given array.
 * @param messages the array to append the SingleMessage to.
 * @param message the props of the added SingleMessage should have.
 */
function messageReducer(messages: Array<ReactElement>, message: SingleMessageProps): Array<ReactElement> {

    return [
        ...messages,
        <SingleMessage content={message.content} type={message.type} timer={message.timer} key={messages.length}/>
    ];
}

function Messages({style, yAlignment, xAlignment, children}: MessagesProps) {
    const [messages, showMessage] = useReducer(messageReducer, new Array<ReactElement>());

    const add = useCallback(function (content: ReactNode, type: MessageTypes, timer?: number) {
        showMessage({content: content, type: type, timer: timer});
    }, [showMessage]);

    const context = useMemo(() => {
        return {
            add: add,
            addWithProps: showMessage
        } as IMessageContext
    }, [showMessage, add]);


    return (
        <>
            <MessageContext.Provider value={context}>
                {children}
            </MessageContext.Provider>
            <div style={style}
                 className={["messages", yAlignment.toLowerCase(), xAlignment.toLowerCase()].join(" ")}>
                {messages}
            </div>
        </>

    );
}

Messages.TIMER = 3000;


export function useMessageContext() {
    return useContext(MessageContext)
}

export interface WithMessagesContextProps{
    messageContext: IMessageContext
}

/**
 * creates a new component with receives a messageContext as prop.
 * @deprecated use a function component and useMessageContext instead.
 * @param Component the component to wrap
 */
export const withMessagesContext = <P extends object>(Component: React.ComponentType<P & WithMessagesContextProps>) =>
    class WithMessages extends React.Component<P> {
        render() {
            return (
                <MessageContext.Consumer>
                    {messageContext =>
                        <Component {...this.props} messageContext={messageContext}/>
                    }
                </MessageContext.Consumer>
            )

        }
    };

export {
    Messages,
    SingleMessage
}
