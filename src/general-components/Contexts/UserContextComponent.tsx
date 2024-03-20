import {Component, createContext, useContext} from "react";
import {User} from "../User";
import {Session} from "../Session/Session";


export interface IUserContext {
    /**
     * the currently logged in user, or null
     */
    user: User | null,

    isLoggedIn: boolean;
}

export interface UserContextState {
    userContext: IUserContext
}

export const UserContext = createContext<IUserContext>({
    user: null,
    isLoggedIn: false
});

export function useUserContext() {
    return useContext(UserContext);
}

export class UserContextComponent extends Component<any, UserContextState> {

    constructor(props: any) {
        super(props);

        this.state = {
            userContext: {
                user: Session.isLoggedIn() ? Session.currentUser : null,
                isLoggedIn: Session.isLoggedIn()
            }
        }
    }


    render() {
        return (
            <UserContext.Provider value={this.state.userContext}>
                {this.props.children}
            </UserContext.Provider>
        );
    }

    /**
     * Listener der aufgerufen wird, wenn sich der aktuell angemeldete Nutzer �ndert
     * @param user Der aktuelle Nutzer, null wenn kein Nutzer angemeldet ist
     */
    userChanged = async (user: User | null) => {
        if (Session.isLoggedIn()) {
            this.setState({
                userContext: {
                    user: user,
                    isLoggedIn: true
                }
            })
        } else {
            this.setState({
                userContext: {
                    user: null,
                    isLoggedIn: false
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

}



