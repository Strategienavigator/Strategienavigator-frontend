import {PaginationLoader} from "./PaginationLoader";
import {SettingResource, UserSettingResource} from "../Datastructures";
import * as Settings from "../../general-components/API/calls/Settings";
import {SettingsList, UserSetting} from "../Settings/SettingsList";


/**
 * Speichert alle Einstellungsmöglichkeiten und aktualisiert diese regelmäßig
 */
export class SettingsCache {


    private settingsLoader: PaginationLoader<SettingResource>;
    private userSettingsLoader: PaginationLoader<UserSettingResource>;

    constructor(userId: number) {
        this._userId = userId;
        this._lastLoad = new Date(0);
        this._userSettings = new SettingsList();

        this.settingsLoader = new PaginationLoader<SettingResource>((page) => {
            return Settings.getSettings(page)
        })
        this.userSettingsLoader = new PaginationLoader<UserSettingResource>((page) => {
            return Settings.getUserSettings(userId, page)
        })

    }

    private _userId: number;

    get userId(): number {
        return this._userId;
    }

    private set userId(value: number) {
        this._userId = value;
    }

    /**
     * last time settings did get updated
     * @private
     */
    private _lastLoad: Date;

    get lastLoad(): Date {
        return this._lastLoad;
    }

    private set lastLoad(value: Date) {
        this._lastLoad = value;
    }

    /**
     * all settings with the current value
     * @private
     */
    private _userSettings: SettingsList;

    /**
     * Alle Einstellungen als SettingsList instanz
     */
    get userSettings(): SettingsList {
        return this._userSettings;
    }

    private set userSettings(value: SettingsList) {
        this._userSettings = value;
    }

    /**
     * Lädt alle Einstellungen inklusive die Einstellungen selbst aus dem Backend neu
     */
    public async updateData() {
        this._userSettings = SettingsList.FromArray(await this.loadData());
        this._lastLoad = new Date();
    }

    /**
     * Lädt ausschließlich die von den Usern geänderte Einstellungen aus dem Backend neu
     */
    public async updateUserData() {
        this._userSettings = SettingsList.FromArray(await this.loadData(true));
        this._lastLoad = new Date();
    }

    /**
     * Gibt an ob die Daten veraltet sind und neu geladen werden sollten
     */
    public shouldUpdate() {
        let today = new Date();
        let diff = today.getTime() - this.lastLoad.getTime()
        return diff > 300000// 1000*60*5 5min
    }

    /**
     * Lädt alle Daten aus dem Backend, wenn nicht anders angegeben, werden keine Caches berücksichtigt
     * @param cachedSettings Ob die Einstellungen auch aus dem Cache geladen werden dürfen
     * @param cachedUserSettings Ob die User Einstellungen auch aus dem Cache geladen werden dürfen
     * @private
     */
    private async loadData(cachedSettings: boolean = false, cachedUserSettings: boolean = false) {
        // Promise.all damit die Backend calls gleichzeitig stattfinden können und nicht nacheinander passieren müssen
        const [settings, userSettings] = await Promise.all([this.settingsLoader.getAll(cachedSettings), this.userSettingsLoader.getAll(cachedUserSettings)]);
        return settings.map((s) => {
            let userS = userSettings.find((su) => su.setting_id === s.id);
            let v = s.default;
            if (!!userS && !!userS.value) {
                v = userS.value;
            }

            return {...s, value: v, exists: !!userS} as UserSetting;
        })
    }
}
