import {Component} from "react";

import "./settings.scss";
import {ToggleSettingType} from "../../../general-components/Settings/Types/ToggleType/ToggleSettingType";
import {Loader} from "../../../general-components/Loader/Loader";
import * as SettingsAPI from "../../../general-components/API/calls/Settings"
import {SettingResource, UserSettingResource} from "../../../general-components/Datastructures";
import {PaginationLoader} from "../../../general-components/API/PaginationLoader";
import {Session} from "../../../general-components/Session/Session";
import {SettingsTypeProps} from "../../../general-components/Settings/Types/SettingsTypeProps";
import {callAPI, CallInterface} from "../../../general-components/API/API";
import {Button} from "react-bootstrap";

export interface UserSettingProxy extends UserSettingResource {
    newResource: boolean
    oldValue: string
}

export interface SettingsState {
    settings: SettingResource[],
    userSettings: UserSettingProxy[],
    saving: boolean
}

export class Settings extends Component<{}, SettingsState> {


    static typeDict: { [id: string]: (props: SettingsTypeProps, key: string | number) => JSX.Element } = {
        "toggle": (props: SettingsTypeProps, key: string | number) => {
            return <ToggleSettingType {...props} key={key}/>
        }
    }
    private settingsLoader: PaginationLoader<SettingResource>;
    private userSettingsLoader: PaginationLoader<UserSettingResource>;


    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: {} | Readonly<{}>, context?: any) {
        super(props, context);
        this.state = {settings: [], userSettings: [], saving: false};

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
        let userSettingProxy = this.getUserSettingProxy(id);
        let userSettingsArray = this.state.userSettings.slice();
        if (userSettingProxy) {
            userSettingProxy.value = value;
        } else {
            let userId = Session.currentUser?.getID();
            if (userId) {
                userSettingProxy = {setting_id: id, user_id: userId, newResource: true, oldValue: "", value: value};
                userSettingsArray.push(userSettingProxy);
            } else {
                // TODO navigate to home screen
                return;
            }
        }

        this.setState({
            userSettings: userSettingsArray
        });
    }

    getUserSettingProxy(settingId: number) {
        return this.state.userSettings.find(value => value.setting_id === settingId);
    }

    async loadSettings() {
        let userSettings = (await this.userSettingsLoader.getAll()).map(value => {
            return {dirty: false, newResource: false, oldValue: value.value, ...value} as UserSettingProxy;
        });

        this.setState({
            settings: await this.settingsLoader.getAll(),
            userSettings: userSettings
        });
    }

    async saveSettings(userSettings: UserSettingProxy[]) {
        if (Session.isLoggedIn()) {
            let userId = Session.currentUser?.getID();
            let token = Session.getToken();
            if (typeof userId === "number" && typeof token === "string") {
                let safeUserId = userId; // stupid but it works. Compiler thinks the above if doesn't apply to the map callback
                let safeToken = token;
                this.setState({
                    saving:true
                })
                let promises = userSettings.filter(value => value.value !== value.oldValue || value.newResource).map(setting => {
                    let f = SettingsAPI.updateUserSettings;
                    if(setting.newResource){
                        f = SettingsAPI.createUserSettings;
                    }
                    let result = f(safeUserId, setting.setting_id, safeToken, setting.value);
                    setting.newResource = false;
                    setting.oldValue = setting.value;
                    return result;
                });

                await Promise.all(promises);
                this.setState({
                    saving:false,
                    userSettings:userSettings
                });
            }
        }
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
                    valueChanged: this.settingChanged.bind(this, setting.id)
                }, setting.id);
            }
            return null;
        });
        return (
            <>
                <Loader payload={[this.loadSettings.bind(this)]}>
                    {settings}
                    <Button variant={"primary"} className={"mt-3"} onClick={async (event) => await this.saveSettings(this.state.userSettings)} disabled={this.state.saving}>
                        {this.state.saving ? "Speichert...":"Speichern"}
                    </Button>
                </Loader>

            </>
        );
    }

}
