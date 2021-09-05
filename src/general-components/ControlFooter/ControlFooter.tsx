import React, {Component, ReactNode} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";
import {RouteComponentProps, StaticContext, withRouter} from "react-router";
import {faCaretRight, faHome, faSave, faUndo} from "@fortawesome/free-solid-svg-icons/";

import "./control-footer.scss";

export interface ControlFooterProps {
    places: number
}

export interface ControlFooterState {
    items: Map<number, ControlFooterItem>
}

export interface NextStepItem {
    nextStep: string
}

export interface SaveStepsItem {
    saveSteps: string
}

export interface ResetStepsItem {
    reset: () => any
}

export interface ButtonItem {
    button: {
        text: string
        icon: IconDefinition
        callback: () => any
    }
}

export interface ToolItem {
    tool: {
        icon: IconDefinition
        title: string
        link: string
    }
}

export type SettingItem = {
    settings: boolean
}

export type NewToolItem = {
    newTool: {
        title: string,
        callback: () => any
    }
}

export type HomeItem = {
    home: boolean
}

export type ControlFooterItem =
    null
    | NextStepItem
    | SaveStepsItem
    | ResetStepsItem
    | ToolItem
    | SettingItem
    | NewToolItem
    | HomeItem
    | ButtonItem;

export const setControlFooterItem = (place: number, item: ControlFooterItem) => {
    ControlFooterComponent._instance?.setItem(place, item);
}

export const clearControlFooter = () => {
    ControlFooterComponent._instance?.clear();
}

export class ControlFooterComponent extends Component<ControlFooterProps & RouteComponentProps, ControlFooterState> {
    public static _instance: undefined | ControlFooterComponent = undefined;
    private static oldItems: Map<number, ControlFooterItem> | undefined;

    constructor(props: (ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>) | Readonly<ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>>) {
        super(props);

        this.state = {
            items: new Map<number, ControlFooterItem>()
        }

        ControlFooterComponent._instance = this;
    }

    componentDidMount() {
        let oldMap = this.state.items;

        if (ControlFooterComponent.oldItems) {
            oldMap = ControlFooterComponent.oldItems;
        } else {
            for (let i = 1; i <= this.props.places; i++) {
                oldMap.set(i, null);
            }
            ControlFooterComponent.oldItems = oldMap;
        }
        this.setState({
            items: oldMap
        });
    }

    render() {
        let places = Array<number>();
        for (let i = 1; i <= this.props.places; i++) {
            places.push(i);
        }

        return (
            <div className={"controlFooter nav"}>
                {places.map(value => {
                    return (
                        <div key={value} className={"item"}>
                            {this.getItem(this.state.items.get(value))}
                        </div>
                    );
                })}
            </div>
        );
    }

    public setItem = (place: number, item: ControlFooterItem) => {
        this.setState(state => {
            const items = state.items.set(place, item);

            return {
                items: items
            }
        });
    }

    public clear = () => {
        this.setState({
            items: new Map<number, ControlFooterItem>()
        });
    }

    private getItem = (item: ControlFooterItem | undefined): null | ReactNode => {
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
                    <button key={"nextStep"} className={"btn-transparent"} form={item.nextStep} type={"submit"}>
                        <FontAwesomeIcon icon={faCaretRight}/> Weiter
                    </button>
                );
            }
            if ("saveSteps" in item) {
                return (
                    <button key={"saveSteps"} className={"btn-transparent"} form={item.saveSteps} type={"submit"}>
                        <FontAwesomeIcon icon={faSave}/> Speichern
                    </button>
                );
            }
            if ("reset" in item) {
                return (
                    <button key={"reset"} onClick={() => item.reset()} className={"btn-transparent"}
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
                    <button key={"newTool"} type={"button"} className={"btn-transparent"}
                            onClick={() => item.newTool.callback()}>
                        <FontAwesomeIcon icon={faPlusSquare}/> {item.newTool?.title}
                    </button>
                );
            }
            if ("button" in item) {
                return (
                    <button key={"button"} className={"btn-transparent"} onClick={() => item.button.callback()}
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
