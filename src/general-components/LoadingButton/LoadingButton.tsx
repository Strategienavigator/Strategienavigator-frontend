import React, {Component, ReactNode} from "react";
import {Button, ButtonProps} from "react-bootstrap";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import FAE from "../Icons/FAE";


export interface LoadingButtonProps extends ButtonProps {
    isSaving: boolean
    savingChild: ReactNode
    defaultChild: ReactNode
    showIcons: boolean
    defaultIcon: IconDefinition
}

export class LoadingButton extends Component<LoadingButtonProps, {}> {

    static defaultProps = {
        showIcons: true,
        defaultIcon: faSave
    }

    render() {
        return (
            <Button
                {...(this.props as ButtonProps)}
                disabled={this.props.isSaving}
            >

                {!this.props.isSaving ? (
                    <>{this.props.showIcons && (<FAE icon={this.props.defaultIcon}/>)} {this.props.defaultChild}</>
                ) : (

                    this.props.showIcons ? (
                            <Loader payload={[]} variant={this.props.variant === "dark" ? "dark" : "light"}
                                    text={<span>&nbsp;{this.props.savingChild}</span>}
                                    transparent size={20} loaded={false}/>)
                        : this.props.savingChild

                )}
            </Button>
        );
    }
}
