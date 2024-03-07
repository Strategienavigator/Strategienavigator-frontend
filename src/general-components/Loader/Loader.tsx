import React, {Component, ReactNode} from "react";
import {Spinner} from "react-bootstrap";

import "./loader.scss";


export interface LoaderState {
    loaded: boolean
}

export type LoaderVariants = "auto" | "light" | "dark" | "style";
export type LoaderAlignments = "center" | "right" | "left";

export interface LoaderProps {
    payload: Array<() => Promise<any>>
    text?: ReactNode
    loaded?: boolean
    fullscreen?: boolean
    variant?: LoaderVariants
    alignment?: LoaderAlignments
    transparent?: boolean
    animate?: boolean
    size?: number,
    children?: ReactNode
}

export class Loader extends Component<LoaderProps, LoaderState> {

    constructor(props: LoaderProps | Readonly<LoaderProps>) {
        super(props);

        this.state = {
            loaded: (this.props.loaded !== undefined) ? this.props.loaded : false
        }
    }

    componentDidMount = async () => {
        await this.loadPayload();

        if (this.props.loaded === undefined) {
            this.setState({
                loaded: true
            })
        }
    }


    loadPayload = async () => {
        if (this.props.payload.length > 0) {
            for await (const value of this.props.payload) {
                await value.call(value);
            }
        }
    }

    render() {
        let loaded = (this.props.loaded !== undefined) ? this.props.loaded : this.state.loaded;

        return (
            <>
                {(this.props.animate || !loaded) && (
                    <div
                        className={
                            ["loader",
                                loaded && "loaded",
                                this.props.fullscreen ? "fullscreen" : "",
                                this.props.animate ? "animate" : "",
                                this.props.transparent ? "transparent" : "",
                                this.props.alignment ?? "center",
                                this.props.variant ?? "auto"
                            ].join(" ")
                        }>
                        <Spinner className={"spinner"}
                                 style={(this.props.size) ? {width: this.props.size, height: this.props.size} : {}}
                                 animation={"border"}/>
                        <span className={"text"}>{this.props.text}</span>
                    </div>
                )}

                {(loaded) && (
                    this.props.children
                )}
            </>
        );
    }

}
