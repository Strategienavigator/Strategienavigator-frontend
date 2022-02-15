import React, {Component, ReactNode} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";
import {RouteComponentProps, StaticContext, withRouter} from "react-router";
import {faCaretRight, faHome, faSave, faUndo} from "@fortawesome/free-solid-svg-icons/";

import "./control-footer.scss";
import {isDesktop} from "../Desktop";
import {FooterContext} from "../Contexts/FooterContextComponent";


export interface ControlFooterProps {
    places: number
}

interface ControlFooterItem {
    disabled?: boolean
}

export interface NextStepItem extends ControlFooterItem {
    nextStep: () => void
}


export interface SaveStepsItem extends ControlFooterItem {
    saveSteps: string
}

export interface ResetStepsItem extends ControlFooterItem {
    reset: () => any
}

export interface ButtonItem extends ControlFooterItem {
    button: {
        text: string
        icon: IconDefinition
        callback: () => any
    }
}

export interface ToolItem extends ControlFooterItem {
    tool: {
        icon: IconDefinition
        title: string
        link: string
    }
}

export interface SettingItem extends ControlFooterItem {
    settings: boolean
}

export interface NewToolItem extends ControlFooterItem {
    newTool: {
        title: string,
        callback: () => any
    }
}

export interface HomeItem extends ControlFooterItem {
    home: boolean
}

export type ControlFooterItemType =
    null
    | NextStepItem
    | SaveStepsItem
    | ResetStepsItem
    | ToolItem
    | SettingItem
    | NewToolItem
    | HomeItem
    | ButtonItem;

export class ControlFooterComponent extends Component<ControlFooterProps & RouteComponentProps, {}> {

    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>
    constructor(props: (ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>) | Readonly<ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>>) {
        super(props);
     }

    render() {
        let places = Array<number>();
        for (let i = 1; i <= this.props.places; i++) {
            places.push(i);
        }

        let classes = ["controlFooter", "nav"];
        if (!isDesktop()) classes.push("show");

        return (
            <div className={classes.join(" ")}>
                {places.map(value => {
                    return (
                        <div key={value} className={"item"}>
                            {this.getItem(this.context.items.get(value))}
                        </div>
                    );
                })}
            </div>
        );
    }

    private getItem = (item: ControlFooterItemType | undefined): null | ReactNode => {
        if (item !== undefined && item !== null) {
            if ("home" in item) {
                return (
                    <NavLink key={"home"} to={"/"} exact>
                        <FontAwesomeIcon icon={faHome}/> Startseite
                    </NavLink>
                );
            }
            if ("nextStep" in item) {
                return (
                    <button disabled={item.disabled} key={"nextStep"} className={"btn-transparent"} onClick={item.nextStep}
                            type={"button"}>
                        <FontAwesomeIcon icon={faCaretRight}/> Weiter
                    </button>
                );
            }
            if ("saveSteps" in item) {
                return (
                    <button disabled={item.disabled} key={"saveSteps"} className={"btn-transparent"}
                            form={item.saveSteps} type={"submit"}>
                        {/*TODO change to non submit type*/}
                        <FontAwesomeIcon icon={faSave}/> Speichern
                    </button>

                );
            }
            if ("reset" in item) {
                return (
                    <button disabled={item.disabled} key={"reset"} onClick={() => item.reset()}
                            className={"btn-transparent"}
                            type={"button"}>
                        <FontAwesomeIcon icon={faUndo}/> Zurücksetzen
                    </button>
                );
            }
            if ("tool" in item) {
                return (
                    <NavLink key={"tool"} to={item.tool?.link} exact>
                        <FontAwesomeIcon icon={item.tool?.icon}/> {item.tool?.title}
                    </NavLink>
                );
            }
            if ("settings" in item) {
                return (
                    <NavLink key={"settings"} to={"/settings"} exact>
                        <FontAwesomeIcon icon={faCogs}/> Einstellungen
                    </NavLink>
                );
            }
            if ("newTool" in item) {
                return (
                    <button disabled={item.disabled} key={"newTool"} type={"button"} className={"btn-transparent"}
                            onClick={() => item.newTool.callback()}>
                        <FontAwesomeIcon icon={faPlusSquare}/> {item.newTool?.title}
                    </button>
                );
            }
            if ("button" in item) {
                return (
                    <button disabled={item.disabled} key={"button"} className={"btn-transparent"}
                            onClick={() => item.button.callback()}
                            type={"button"}>
                        <FontAwesomeIcon icon={item.button.icon}/> {item.button.text}
                    </button>
                );
            }
        }
        return null;
    }


}

export const ControlFooter = withRouter(ControlFooterComponent);
