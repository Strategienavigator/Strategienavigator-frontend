import React, {Component, ReactNode} from "react";
import {Button, ButtonProps} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";


export interface LoadingButtonProps extends ButtonProps {
    isSaving:boolean
    savingChild:ReactNode
    defaultChild:ReactNode
}
export class LoadingButton extends Component<LoadingButtonProps, any>{


    render() {
        return (
            <Button
                {...(this.props as ButtonProps)}
                disabled={this.props.isSaving}
            >
                {!this.props.isSaving ? (
                    <><FontAwesomeIcon icon={faSave}/> {this.props.defaultChild}</>
                ) : (
                    <Loader payload={[]} variant={this.props.variant === "dark"?"dark":"light"} text={<span>&nbsp;{this.props.savingChild}</span>}
                            transparent size={20} loaded={false}/>
                )}
            </Button>
        );
    }
}
