import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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


export interface UniqueCheckProps {
    callback?: ((input: string, apiArgs?: APIArgs) => Promise<CallInterface<DefaultResponse<AvailabilityCheckResource>> | null>)
    failMessage?: string
    successMessage?: string
    suppressErrors: boolean
}

export interface UniqueCheckState {
    isLoading: boolean
    success?: boolean
    error: boolean
}

export class UniqueCheck extends Component<ReplaceProps<"input", FormControlProps> & UniqueCheckProps, UniqueCheckState> {
    static defaultProps = {
        suppressErrors: false
    }
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: (Omit<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & { ref?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined; }, FormControlProps> & FormControlProps & UniqueCheckProps) | Readonly<Omit<Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "key" | keyof React.InputHTMLAttributes<HTMLInputElement>> & { ref?: ((instance: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null | undefined; }, FormControlProps> & FormControlProps & UniqueCheckProps>) {
        super(props);

        this.state = {
            isLoading: false,
            error: false
        };
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
                        }else{
                            this.props.callback(value, {errorCallback: reject}).then(resolve).catch(reject);
                        }
                    });


                    if (call?.success) {
                        this.setState({
                            success: call.callData.data.available,
                            isLoading: false,
                            error: false
                        });
                        return;
                    }
                } catch (reason) {
                    console.error(reason);
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
                    <FontAwesomeIcon icon={faTimes}/> Die Verfügbarkeit konnte nicht überprüft werden.
                </div>
            )}
            {(!this.state.isLoading && this.state.success !== undefined && !this.state.success) && (
                <div className={"feedback DANGER"}>
                    <FontAwesomeIcon icon={faTimes}/> {this.props.failMessage}
                </div>
            )}
            {(!this.state.isLoading && this.state.success !== undefined && this.state.success) && (
                <div className={"feedback SUCCESS"}>
                    <FontAwesomeIcon icon={faCheck}/> {this.props.successMessage}
                </div>
            )}
        </>)
    }

    render = () => {
        let propsForInput = {...this.props};
        delete propsForInput.failMessage;
        delete propsForInput.successMessage;
        delete propsForInput.callback;

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
                        !this.props.suppressErrors && this.renderErrors()
                    }

                </div>
            </>
        );
    }

}
