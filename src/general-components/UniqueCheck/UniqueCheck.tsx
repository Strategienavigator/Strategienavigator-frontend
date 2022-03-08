import * as React from "react";
import {Component} from "react";
import {Form, FormControlProps} from "react-bootstrap";
import {Omit, ReplaceProps} from "react-bootstrap/helpers";
import {APIArgs, CallInterface} from "../API/API";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";

import "./unique-check.scss";
import {AvailabilityCheckResource, DefaultResponse} from "../Datastructures";
import FAE from "../Icons/FAE";


export interface UniqueCheckProps {
    callback?: ((input: string, apiArgs?: APIArgs) => Promise<CallInterface<DefaultResponse<AvailabilityCheckResource>> | null>)
    entityName: string
    suppressErrors: boolean
}

export interface UniqueCheckState {
    isLoading: boolean
    success?: boolean
    reason?: "taken" | "blocked" | "invalid"
    error: boolean
}

export class UniqueCheck extends Component<ReplaceProps<"input", FormControlProps> & UniqueCheckProps, UniqueCheckState> {
    static defaultProps = {
        suppressErrors: false,

    }
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: (Omit<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & { ref?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined; }, FormControlProps> & FormControlProps & UniqueCheckProps) | Readonly<Omit<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & { ref?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined; }, FormControlProps> & FormControlProps & UniqueCheckProps>) {
        super(props);

        this.state = {
            isLoading: false,
            error: false
        };
    }


    private getFailMessage() {
        return "Die Verfügbarkeit konnte nicht überprüft werden.";
    }

    private getTakenMessage() {
        return this.props.entityName + " ist nicht Verfügbar!";
    }

    private getAvailableMessage() {
        return this.props.entityName + " ist Verfügbar!";
    }

    private getInvalidMessage() {
        return this.props.entityName + " ist nicht korrekt!";
    }

    private getBlockedMessage() {
        return this.props.entityName + " ist nicht erlaubt!";
    }

    private getMessage() {
        if (this.state.success) {
            return this.getAvailableMessage();
        } else {
            switch (this.state.reason) {
                case "invalid":
                    return this.getInvalidMessage();
                case "taken":
                    return this.getTakenMessage();
                case "blocked":
                    return this.getBlockedMessage();
                default:
                    return this.getTakenMessage();
            }
        }

    }

    /**
     * Will fix the "Can't perform a React state update on an unmounted component" error. Doing this will replace the setState function so it will just return nothing.
     * This is considered pretty hacky
     */
    componentWillUnmount() {
        this.setState = (() => {
            return;
        });
    }


    renderErrors = () => {
        return (<>
            {(!this.state.isLoading && this.state.error) && (
                <div className={"feedback DANGER"}>
                    <FAE icon={faTimes}/> {this.getFailMessage()}
                </div>
            )}
            {(!this.state.isLoading && !this.state.error && this.state.success !== undefined) && (
                <div className={"feedback " + (this.state.success ? "SUCCESS" : "DANGER")}>
                    {!this.state.success && <FAE icon={faTimes}/>} {this.getMessage()}
                </div>
            )}
        </>)
    }

    render = () => {
        let {callback, entityName, suppressErrors, ...propsForInput} = this.props;

        return (
            <>
                <Form.Control
                    onChange={(e) => this.changed(e)}
                    {...propsForInput}
                />
                <div className={"uniqueOutput feedbackContainer"}>
                    {this.state.isLoading && (
                        <div className={"feedback"}>
                            <Loader payload={[]} size={30} alignment={"left"} text={"Lädt..."} transparent
                                    loaded={false}/>
                        </div>
                    )}

                    {
                        !suppressErrors && this.renderErrors()
                    }

                </div>
            </>
        );
    }


    changed = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        let value = e.currentTarget.value;
        if (value.length > 0) {
            this.timeout = setTimeout(async () => {
                this.setState({
                    isLoading: true
                });

                try {
                    // wrap the errorCallback in a Promise, so it can get awaited
                    let call = await new Promise<CallInterface<DefaultResponse<AvailabilityCheckResource>> | null>((resolve, reject) => {
                        if (this.props.callback === undefined) {
                            reject(new Error("callback is undefined"));
                        } else {
                            this.props.callback(value, {errorCallback: reject}).then(resolve).catch(reject);
                        }
                    });


                    if (call?.success) {
                        this.setState({
                            success: call.callData.data.available,
                            reason: call.callData.data.reason,
                            isLoading: false,
                            error: false
                        });
                        return;
                    }
                } catch (reason) {
                    console.dir(reason);
                }


                this.setState({
                    success: undefined,
                    error: true,
                    isLoading: false
                });
            }, 600);
        } else {
            this.setState({
                success: undefined,
                error: false
            });
        }
    }

}
