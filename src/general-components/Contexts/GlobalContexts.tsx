import {Component, createContext} from "react";
import {SettingsCache} from "../API/SettingsCache";
import {SettingsList} from "../Settings/SettingsList";
import {Session} from "../Session/Session";
import {User} from "../User";


export interface ISettingsContext {
    causeUpdate: () => void,
    settings: SettingsList,
    isLoading: boolean
}

export interface AppState {
    settingsContext: ISettingsContext
}

export const SettingsContext = createContext<ISettingsContext>({
    causeUpdate: () => {
    },
    settings: new SettingsList(),
    isLoading: false
});

export class GlobalContexts extends Component<{}, AppState> {
    private settingsCache?: SettingsCache;

    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: Readonly<{}> | {}, context?: any) {
        super(props, context);
        this.state = {
            settingsContext: {
                causeUpdate: this.updateSettings, settings: new SettingsList(), isLoading: false
            }
        };
    }

    private setLoading(isLoading: boolean) {

        this.setState({
            settingsContext: {
                settings: this.state.settingsContext.settings,
                causeUpdate: this.updateSettings,
                isLoading: isLoading
            }
        });

    }


    userChanged = async (user: User | null) => {
        if (Session.isLoggedIn()) {
            this.settingsCache = new SettingsCache(Session.getToken() as string, user?.getID() as number);
            await this.updateSettings();
        } else {
            delete this.settingsCache;
            this.setState({
                settingsContext: {
                    settings: new SettingsList(),
                    causeUpdate: this.updateSettings,
                    isLoading: false
                }
            });
        }
    }

    componentDidMount() {
        Session.addUserChangedCallback(this.userChanged);
    }


    componentWillUnmount() {
        Session.removeUserChangedCallback(this.userChanged);
    }

    updateSettings = async () => {
        if (this.settingsCache) {
            this.setLoading(true);

            await this.settingsCache.updateData()

            this.setState({
                settingsContext: {
                    causeUpdate: this.updateSettings,
                    settings: this.settingsCache.userSettings,
                    isLoading: false
                }
            });
        }
    }


    render() {
        return (
            <SettingsContext.Provider value={this.state.settingsContext}>
                {this.props.children}
            </SettingsContext.Provider>
        );
    }
}
