import {Component} from "react";

import "./settings.scss";
import {
    ToggleSettingType,
    ToggleSettingTypeProps
} from "../../../general-components/Settings/Types/ToggleType/ToggleSettingType";
import {Loader} from "../../../general-components/Loader/Loader";
import * as SettingsAPI from "../../../general-components/API/calls/Settings"
import {SettingResource, UserSettingResource} from "../../../general-components/Datastructures";
import {PaginationLoader} from "../../../general-components/API/PaginationLoader";
import {Session} from "../../../general-components/Session/Session";
import {SettingsTypeProps} from "../../../general-components/Settings/Types/SettingsTypeProps";


export interface SettingsState {
    settings: SettingResource[],
    userSettings: UserSettingResource[],
}

export class Settings extends Component<{}, SettingsState> {


    static typeDict: { [id: string]: (props: SettingsTypeProps) => JSX.Element } = {
        "toggle": (props: SettingsTypeProps) => {
            return <ToggleSettingType {...props}/>
        }
    }
    private settingsLoader: PaginationLoader<SettingResource>;
    private userSettingsLoader: PaginationLoader<UserSettingResource>;


    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: {} | Readonly<{}>, context?: any) {
        super(props, context);
        this.state = {settings: [], userSettings: []};

        this.settingsLoader = new PaginationLoader(async (page) => {
            let token = Session.getToken();
            if (token !== null) {
                return await SettingsAPI.getSettings(token, page);
            }
            return null;
        });

        this.userSettingsLoader = new PaginationLoader(async (page) => {
            let token = Session.getToken();
            let userId = Session.currentUser?.getID();
            if (token && userId) {
                return await SettingsAPI.getUserSettings(userId, token, page);
            }
            return null;
        });
    }

    settingChanged(id: number, value: string) {

    }

    async loadSettings() {

        this.setState({
            settings: await this.settingsLoader.getAll(),
            userSettings: await this.userSettingsLoader.getAll()
        });
    }

    render() {

        let settings = this.state.settings.map(setting => {
            let f = Settings.typeDict[setting.type];
            if (f) {
                let userSetting = this.state.userSettings.find(us => us.setting_id === setting.id);
                let v = setting.default;
                if (userSetting) {
                    if (userSetting.value) {
                        v = userSetting.value;
                    }
                }
                return f({
                    name: setting.name,
                    description: setting.description,
                    extras: setting.extras,
                    value: v,
                    valueChanged: this.settingChanged.bind(this,setting.id)
                });
            }
            return null;
        });
        return (
            <>
                <Loader payload={[this.loadSettings.bind(this)]} children={settings}/>
            </>
        );
    }

}
