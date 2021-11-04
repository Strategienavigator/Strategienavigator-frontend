import {SettingResource} from "../Datastructures";

export interface UserSetting extends SettingResource {
    /**
     * Current Value of the setting, if exists is false, this has the default value of the setting
     */
    value: string
    /**
     * Whether the user already did override the default value
     */
    exists: boolean
}

export class SettingsList{
    private readonly settings:Array<UserSetting>;


    constructor() {
        this.settings = [];
    }

    public static FromArray(settings: UserSetting[]) {
        let sList = new SettingsList();
        for (const s of settings) {
            sList.addSetting(s)
        }
        return sList;
    }

    public addSetting(setting: UserSetting) {
        if (!(setting.name in this.settings)) {
            this.settings[setting.id] = setting;
        } else {
            throw new Error("Use set setting to replace a setting");
        }
    }

    public setSetting(setting: UserSetting) {
        this.settings[setting.id] = setting;
    }

    public removeSetting(setting: UserSetting | number) {
        let key:number;
        if(typeof setting === "number"){
            key = setting as number;
        }else{
            key = (setting as UserSetting).id;
        }

        delete this.settings[key];
    }

    public getSetting(settingId: number){
        return this.settings[settingId];
    }

    public toArray(){
        return this.settings.slice();
    }
}
