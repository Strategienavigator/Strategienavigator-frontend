import {User} from "../User";
import {callAPI, CallInterface} from "../API/API";
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

    static setCurrent = (user: User | null) => {
        Session.currentUser = user;
    }

    static updateTokens = (token: string, refreshToken?: string) => {
        Session.token.setToken(token);
        if (refreshToken !== undefined) {
            Session.refreshToken.setToken(refreshToken);
        }
    }

    static logout = async () => {
        let call = await callAPI("oauth/token/" + Session.token.breakDown()?.id, "DELETE", undefined, Session.token.getToken() as string);

        if (call.success) {
            Session.setCurrent(null);
            Session.removeTokens();
        }
        return call;
    }

    static getToken(): string | null {
        return Session.token.getToken();
    }

    static removeTokens = () => {
        Session.token.delete();
        Session.refreshToken.delete();
    }

    static checkLogin = async (): Promise<any> => {
        let validToken = Session.token.getValidTokenBreakdown();
        if (validToken !== null) {
            let token = Session.token.getToken() as string;
            let call = await callAPI("api/users/" + validToken.userId, "GET", undefined, token);

            if (call.success) {
                let user = User.from(call.callData.data);
                Session.setCurrent(user);
                return user;
            } else {
                if (call.status === 401) {
                    Session.removeTokens();
                }
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

    static login = async (email: string, password: string, rememberMe?: boolean): Promise<User | null> => {
        let formData: FormData = new FormData();
        formData.append('grant_type', 'password');
        formData.append('client_id', String(process.env.REACT_APP_CLIENT_ID));
        formData.append('client_secret', process.env.REACT_APP_CLIENT_SECRET);
        formData.append('username', email);
        formData.append('password', password);
        formData.append('scope', '');

        let call = await callAPI('oauth/token', 'POST', formData);

        if (call.success) {
            let data: any = call.callData;
            Session.updateTokens(data.access_token, (rememberMe) ? data.refresh_token : undefined);
            return await Session.checkLogin();
        }
        return null;
    }

    static register = async (email: string, username: string, password: string): Promise<CallInterface> => {
        let formData: FormData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

        return await callAPI('api/users', 'POST', formData);
    }

}

export {
    Session
}
