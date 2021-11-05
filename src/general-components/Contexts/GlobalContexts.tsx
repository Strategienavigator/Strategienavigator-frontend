import {Component, createContext} from "react";
import {SettingsCache} from "../API/SettingsCache";
import {SettingsList} from "../Settings/SettingsList";
import {Session} from "../Session/Session";
import {User} from "../User";


export interface ISettingsContext {
    /**
     * sorgt dafür, dass alle Einstellungen aus Backend neu geladen werden
     */
    causeUpdate: () => void,
    /**
     * Liste aller Einstellungen
     */
    settings: SettingsList,
    /**
     * Ob die Einstellungen gerade aus dem geladen werden
     */
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

    /**
     * Ändert den State
     * @param isLoading ob das die Einstellungen gerade aus dem Backend abgerufen werden
     * @private
     */
    private setLoading(isLoading: boolean) {

        this.setState({
            settingsContext: {
                settings: this.state.settingsContext.settings,
                causeUpdate: this.updateSettings,
                isLoading: isLoading
            }
        });

    }


    /**
     * Listener der aufgerufen wird, wenn sich der aktuell angemeldete Nutzer ändert
     * @param user Der aktuelle Nutzer, null wenn kein Nutzer angemeldet ist
     */
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

    /**
     * registriert den UserChanged Listener
     */
    componentDidMount() {
        Session.addUserChangedCallback(this.userChanged);
    }


    /**
     * Entfernt den UserChanged Listener
     */
    componentWillUnmount() {
        Session.removeUserChangedCallback(this.userChanged);
    }

    /**
     * Lädt alle Einstellungen aus dem Backend neu, ändert die State variable zu den neuen Werten
     */
    updateSettings = async () => {
        if (this.settingsCache) {
            this.setLoading(true);

            await this.settingsCache.updateUserData();

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
