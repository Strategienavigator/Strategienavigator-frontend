import {Component} from "react";
import {SettingsTypeProps} from "../SettingsTypeProps";


import './toggleSettingType.scss'
export interface ToggleSettingTypeProps extends SettingsTypeProps {

}

export class ToggleSettingType extends Component<ToggleSettingTypeProps, {}> {


    constructor(props: Readonly<ToggleSettingTypeProps> | ToggleSettingTypeProps);
    constructor(props: ToggleSettingTypeProps, context: any);
    constructor(props: ToggleSettingTypeProps | Readonly<ToggleSettingTypeProps>, context?: any) {
        super(props, context);
    }


    render() {

        return (
            <div>
                <div className={"settingTextContainer"}>
                    <span className={"settingHeader"}>{this.props.name}</span><br/>
                    <span className={"settingSubheader"}>{this.props.description}</span>
                </div>
                <div></div>
            </div>

        );
    }
}
