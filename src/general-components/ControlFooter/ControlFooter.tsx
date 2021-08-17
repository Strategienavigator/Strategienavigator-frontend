import React, {Component, ReactNode} from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faPlusSquare} from "@fortawesome/free-solid-svg-icons";
import {NavLink} from "react-router-dom";

import "./control-footer.scss";
import {RouteComponentProps, StaticContext, withRouter} from "react-router";
import {faCaretRight, faHome, faSave, faUndo} from "@fortawesome/free-solid-svg-icons/";

export interface ControlFooterProps {
    places: number
}

export interface NextStepItem {
    nextStep: string
}

export interface SaveStepsItem {
    saveSteps: string
}

export interface ResetStepsItem {
    resetSteps: () => void
}

export interface ToolItem {
    tool: {
        icon: IconProp
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
        link: string
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
    | HomeItem;

export const setControlFooterItem = (place: number, item: ControlFooterItem) => {
    ControlFooter._instance?.setItem(place, item);
}

class ControlFooter extends Component<ControlFooterProps & RouteComponentProps, any> {
    public static _instance: undefined | ControlFooter = undefined;
    public items: Map<number, ControlFooterItem> = new Map<number, ControlFooterItem>();

    constructor(props: (ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>) | Readonly<ControlFooterProps & RouteComponentProps<{}, StaticContext, unknown>>) {
        super(props);

        for (let i = 0; i < this.props.places; i++) {
            this.items.set(i, null);
        }
        ControlFooter._instance = this;
    }

    componentDidMount() {
        this.props.history.listen(() => {
            this.items.clear();
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
                            {this.getItem(this.items.get(value))}
                        </div>
                    );
                })}
            </div>
        );
    }

    public setItem = (place: number, item: ControlFooterItem) => {
        this.items.set(place, item);
        this.forceUpdate();
    }

    private getItem = (item: ControlFooterItem | undefined): null | ReactNode => {
        if (item !== undefined && item !== null) {
            if ("home" in item) {
                return (
                    <NavLink to={"/"} exact>
                        <FontAwesomeIcon icon={faHome}/> Startseite
                    </NavLink>
                );
            }
            if ("nextStep" in item) {
                return (
                    <button className={"btn-transparent"} form={item.nextStep} type={"submit"}>
                        <FontAwesomeIcon icon={faCaretRight}/> Weiter
                    </button>
                );
            }
            if ("saveSteps" in item) {
                return (
                    <button className={"btn-transparent"} form={item.saveSteps} type={"submit"}>
                        <FontAwesomeIcon icon={faSave}/> Speichern
                    </button>
                );
            }
            if ("resetSteps" in item) {
                return (
                    <button onClick={() => item.resetSteps?.call(item.resetSteps)} className={"btn-transparent"}
                            type={"button"}>
                        <FontAwesomeIcon icon={faUndo}/> Zurücksetzen
                    </button>
                );
            }
            if ("tool" in item) {
                return (
                    <NavLink to={item.tool?.link} exact>
                        <FontAwesomeIcon icon={item.tool?.icon}/> {item.tool?.title}
                    </NavLink>
                );
            }
            if ("settings" in item) {
                return (
                    <NavLink to={"/settings"} exact>
                        <FontAwesomeIcon icon={faCogs}/> Einstellungen
                    </NavLink>
                );
            }
            if ("newTool" in item) {
                return (
                    <NavLink to={item.newTool?.link} exact>
                        <FontAwesomeIcon icon={faPlusSquare}/> {item.newTool?.title}
                    </NavLink>
                );
            }
        }
        return null;
    }


}

export default withRouter(ControlFooter);
