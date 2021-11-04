import {Component} from "react";

import "./settings.scss";
import {ToggleSettingType} from "../../../general-components/Settings/Types/ToggleType/ToggleSettingType";
import {SettingsTypeProps} from "../../../general-components/Settings/Types/SettingsTypeProps";
import {Button} from "react-bootstrap";
import {ISettingsContext, SettingsContext} from "../../../general-components/Contexts/GlobalContexts";
import * as SettingsAPI from "../../../general-components/API/calls/Settings";
import {Session} from "../../../general-components/Session/Session";
import {Loader} from "../../../general-components/Loader/Loader";


export interface UserSettingProxy {
    setting_id: number
    newValue: string
}

export interface SettingsState {
    settings: UserSettingProxy[]
    saving: boolean
}

export class Settings extends Component<{}, SettingsState> {


    static typeDict: { [id: string]: (props: SettingsTypeProps, key: string | number) => JSX.Element } = {
        "toggle": (props: SettingsTypeProps, key: string | number) => {
            return <ToggleSettingType {...props} key={key}/>
        }
    }

    static contextType = SettingsContext;
    context!: React.ContextType<typeof SettingsContext>

    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: {} | Readonly<{}>, context?: any) {
        super(props, context);
        this.state = {settings: [], saving: false};
    }


    settingChanged(id: number, value: string) {
        let userProxy = this.getUserSettingProxy(id);
        let userSettingsArray = this.state.settings.slice();
        if (userProxy) {
            if (value) {
                userProxy.newValue = value;
            } else {
                userSettingsArray.splice(userSettingsArray.indexOf(userProxy), 1);
            }
        } else {
            userSettingsArray.push({
                setting_id: id,
                newValue: value
            });
        }

        this.setState({
            settings: userSettingsArray
        });
    }

    getUserSettingProxy(settingId: number) {
        return this.state.settings.find(value => value.setting_id === settingId);
    }

    private reset() {
        this.setState({
            settings: []
        });
    }

    render() {
        let settings = this.context.settings.toArray().map(setting => {
            let f = Settings.typeDict[setting.type];
            if (f) {
                let userSetting = this.state.settings.find(us => us.setting_id === setting.id);
                let v = setting.value;
                if (userSetting) {
                    if (userSetting.newValue) {
                        v = userSetting.newValue;
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
                <Loader payload={[]} loaded={!this.context.isLoading} transparent={true}>
                    {settings}
                    <Button variant={"primary"} className={"mt-3"}
                            onClick={async () => await this.saveSettings()}
                            disabled={this.state.saving}>
                        {this.state.saving ? "Speichert..." : "Speichern"}
                    </Button>
                </Loader>
            </>
        );
    }

    private async saveSettings() {
        this.setState({
            saving: true
        });
        const promises = [];
        const context = this.context;
        let settingsList = context.settings;
        for (let s of this.state.settings) {
            let setting = settingsList.getSetting(s.setting_id);
            if (!Object.is(setting.value, s.newValue)) {
                let f = SettingsAPI.createUserSettings;
                if (setting.exists)
                    f = SettingsAPI.updateUserSettings;
                promises.push(f(Session.currentUser!.getID(), setting.id, Session.getToken()!, s.newValue));
            }
        }
        await Promise.all(promises);
        context.causeUpdate();
        this.setState({
            saving: false
        });
        this.reset();
    }
}
