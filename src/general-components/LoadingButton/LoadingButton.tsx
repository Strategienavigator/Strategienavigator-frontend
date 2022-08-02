import React, {Component, ReactNode} from "react";
import {Button, ButtonProps} from "react-bootstrap";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {Loader} from "../Loader/Loader";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import FAE from "../Icons/FAE";


export interface LoadingButtonProps extends ButtonProps {
    /**
     * Whether the loading animation should be played
     */
    isSaving: boolean
    /**
     * What is inside the button while saving
     */
    savingChild: ReactNode
    /**
     * What is inside the button
     */
    defaultChild: ReactNode
    /**
     * Whether to show the icons in front of the specified childs
     */
    showIcons: boolean
    /**
     * Icon which is schon while not saving
     */
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
                    <>{showIcons && (<FAE icon={defaultIcon}/>)} {defaultChild}</>
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
