import {Component, createContext} from "react";
import {SettingsCache} from "../API/SettingsCache";
import {SettingsList} from "../Settings/SettingsList";
import {Session} from "../Session/Session";


export interface ISettingsContext {
    causeUpdate:()=>void,
    settings:SettingsList
}

export interface AppState {
    settingsContext: ISettingsContext
}

export const SettingsContext = createContext<ISettingsContext>({causeUpdate:()=>{},settings:new SettingsList()});

export class GlobalContexts extends Component<{}, AppState> {
    private settingsCache: SettingsCache;

    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: Readonly<{}> | {}, context?: any) {
        super(props, context);
        // TODO use real user data
        this.settingsCache = new SettingsCache(Session.getToken() as string,Session.currentUser?.getID() as number);
        this.state = {
            settingsContext: {causeUpdate: this.updateSettings,settings:this.settingsCache.userSettings}
        };
    }

    updateSettings = async () => {
        await this.settingsCache.updateData()

        this.setState({
            settingsContext: {causeUpdate: this.updateSettings, settings: this.settingsCache.userSettings}
        });
    }


    render() {
        return (
            <SettingsContext.Provider value={this.state.settingsContext}>
                {this.props.children}
            </SettingsContext.Provider>
        );
    }
}
