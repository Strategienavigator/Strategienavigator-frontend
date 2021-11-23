import {SettingsList} from "../Settings/SettingsList";
import {Component, createContext} from "react";
import {User} from "../User";
import {Session} from "../Session/Session";
import {SettingsCache} from "../API/SettingsCache";

export interface ISettingsContext {
    /**
     * sorgt daf�r, dass alle Einstellungen aus Backend neu geladen werden
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

export interface SettingsContextState {
    settingsContext: ISettingsContext
}

export const SettingsContext = createContext<ISettingsContext>({
    causeUpdate: () => {
    },
    settings: new SettingsList(),
    isLoading: false
});

export class SettingsContextComponent extends Component<any, SettingsContextState> {
    private settingsCache?: SettingsCache;

    constructor(props: any) {
        super(props);

        this.state = {
            settingsContext: {
                causeUpdate: () => {
                },
                settings: new SettingsList(),
                isLoading: false
            }
        }
    }


    render() {
        return (
            <SettingsContext.Provider value={this.state.settingsContext}>
                {this.props.children}
            </SettingsContext.Provider>
        );
    }

    /**
     * �ndert den State
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
     * Listener der aufgerufen wird, wenn sich der aktuell angemeldete Nutzer �ndert
     * @param user Der aktuelle Nutzer, null wenn kein Nutzer angemeldet ist
     */
    userChanged = async (user: User | null) => {
        if (Session.isLoggedIn()) {
            this.settingsCache = new SettingsCache(user?.getID() as number);
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
     * L�dt alle Einstellungen aus dem Backend neu, �ndert die State variable zu den neuen Werten
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

}
