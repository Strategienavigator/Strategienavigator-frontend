import {User} from "../User";
import {callAPI} from "../API";
import Token from "./token/Token";
import AuthToken from "./token/AuthToken";
import RefreshToken from "./token/RefreshToken";

class Session {
    static currentUser: User | null = null;

    private static token: AuthToken = new AuthToken();
    private static refreshToken: Token = new RefreshToken();

    static isLoggedIn = (): boolean => {
        return Session.currentUser !== null;
    }

    static setCurrent = (user: User) => {
        Session.currentUser = user;
    }

    static updateTokens = (token: string, refreshToken?: string) => {
        Session.token.setToken(token);
        if (refreshToken !== undefined) {
            Session.refreshToken.setToken(refreshToken);
        }
    }

    static removeTokens = () => {
        Session.token.delete();
        Session.refreshToken.delete();
    }

    static checkLogin = async (): Promise<User | null> => {
        let validToken = Session.token.getValidTokenBreakdown();
        if (validToken !== null) {
            let token = Session.token.getToken() as string;
            let call = await callAPI("api/users/" + validToken.userId, "GET", undefined, token);

            if (call.success) {
                let user = User.from(call.callData.data);
                Session.setCurrent(user);
                return user;
            }
        }
        if (Session.refreshToken.exists()) {
            let refreshToken = Session.refreshToken.getToken() as string;

            let formData: FormData = new FormData();
            formData.append("grant_type", "refresh_token");
            formData.append("refresh_token", refreshToken);
            formData.append("client_id", String(process.env.REACT_APP_CLIENT_ID));
            formData.append("client_secret", process.env.REACT_APP_CLIENT_SECRET);
            formData.append("scope", "");

            let call = await callAPI("oauth/token", "POST", formData);
            if (call.success) {
                let data: any = call.callData;
                Session.updateTokens(data.access_token, data.refresh_token);
                return await Session.checkLogin();
            } else {
                Session.removeTokens();
            }
        }
        return null;
    }

    static login = (username: string, password: string, rememberMe?: boolean) => {
        // TODO: implement
        // if (rememberMe !== undefined) {
        //     Session.refreshToken.setToken("");
        // }
    }

}

export {
    Session
}
