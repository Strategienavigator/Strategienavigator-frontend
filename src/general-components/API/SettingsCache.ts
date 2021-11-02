import {PaginationLoader} from "./PaginationLoader";
import {SettingResource, UserSettingResource} from "../Datastructures";
import * as Settings from "../../general-components/API/calls/Settings";
import {SettingsList, UserSetting} from "../Settings/SettingsList";




/**
 * Speichert alle Einstellungsmöglichkeiten und aktualisiert diese regelmäßig
 */
export class SettingsCache {


    private _userId: number;
    /**
     * last time settings did get updated
     * @private
     */
    private _lastLoad: Date;
    /**
     * all settings with the current value
     * @private
     */
    private _userSettings: SettingsList;

    private settingsLoader: PaginationLoader<SettingResource>;
    private userSettingsLoader: PaginationLoader<UserSettingResource>;

    constructor(token: string, userId: number) {
        this._userId = userId;
        this._lastLoad = new Date(0);
        this._userSettings = new SettingsList();

        this.settingsLoader = new PaginationLoader<SettingResource>((page) => {
            return Settings.getSettings(token, page)
        })
        this.userSettingsLoader = new PaginationLoader<UserSettingResource>((page) => {
            return Settings.getUserSettings(userId, token, page)
        })

    }

    private async loadData() {
        let settings = await this.settingsLoader.getAll();
        let userSettings = await this.userSettingsLoader.getAll();
        return settings.map((s) => {
            let userS = userSettings.find((su) => su.setting_id === s.id);
            let v = s.default;
            if (userS && userS.value && userS.value.length > 0)
                v = userS.value;
            return {...s, value: v} as UserSetting;
        })
    }

    public async updateData() {
        this._userSettings = SettingsList.FromList(await this.loadData());
        this._lastLoad = new Date();
    }


    get lastLoad(): Date {
        return this._lastLoad;
    }

    private set lastLoad(value: Date) {
        this._lastLoad = value;
    }


    get userId(): number {
        return this._userId;
    }

    private set userId(value: number) {
        this._userId = value;
    }

    get userSettings(): SettingsList {
        return this._userSettings;
    }

    private set userSettings(value: SettingsList) {
        this._userSettings = value;
    }

    public shouldUpdate(){
        let today = new Date();
        let diff = today.getTime() - this.lastLoad.getTime()
        return diff > 300000// 1000*60*5 5min
    }
}
