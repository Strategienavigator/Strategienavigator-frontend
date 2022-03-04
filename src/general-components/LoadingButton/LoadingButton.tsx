import React, {Component, ReactNode} from "react";
import {Button, ButtonProps} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";


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
        const {isSaving, savingChild, defaultChild, showIcons, defaultIcon, ...props} = this.props;

        return (
            <Button
                {...props}
                disabled={isSaving}
            >

                {!isSaving ? (
                    <>{showIcons && (<FontAwesomeIcon icon={defaultIcon}/>)} {defaultChild}</>
                ) : (

                    showIcons ? (
                            <Loader payload={[]} variant={props.variant === "dark" ? "dark" : "light"}
                                    text={<span>&nbsp;{savingChild}</span>}
                                    transparent size={20} loaded={false}/>)
                        : savingChild

                )}
            </Button>
        );
    }
}
