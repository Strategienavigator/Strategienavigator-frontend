import {SettingResource} from "../Datastructures";

export interface UserSetting extends SettingResource {
    value: string
}

export class SettingsList {
    private readonly settings: { [key: string]: UserSetting };


    constructor() {
        this.settings = {};
    }

    public static FromList(settings: UserSetting[]) {
        let sList = new SettingsList();
        for (const s of settings) {
            sList.addSetting(s)
        }
        return sList;
    }

    public addSetting(setting: UserSetting) {
        if (!(setting.name in this.settings)) {
            this.settings[setting.name] = setting;
        } else {
            throw new Error("Use set setting to replace a setting");
        }
    }

    public setSetting(setting: UserSetting) {
        this.settings[setting.name] = setting;
    }

    public removeSetting(setting: UserSetting | string) {
        let key = "";
        if(typeof setting === "string"){
            key = setting as string;
        }else{
            key = (setting as UserSetting).name;
        }

        delete this.settings[key];
    }


}
