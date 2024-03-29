import {User} from "../User";
import {callAPI, CallInterface} from "../API/API";
import {Token} from "./token/Token";
import {AuthToken} from "./token/AuthToken";
import {RefreshToken} from "./token/RefreshToken";
import {AnonymousUserResource, DefaultResponse, TokenCreatedResource, UserResource} from "../Datastructures";
import {createUser} from "../API/calls/User";


export type UserCallback = (user: User | null) => void;

class Session {
    static userChangedCallbacks: UserCallback[] = [];
    static currentUser: User | null = null;

    private static token: AuthToken = new AuthToken();
    private static refreshToken: Token = new RefreshToken();

    static addUserChangedCallback(cb: UserCallback) {
        if (!Session.userChangedCallbacks.some((uCb) => uCb === cb)) {
            Session.userChangedCallbacks.push(cb);
        }
    }

    static removeUserChangedCallback(cb: UserCallback) {
        let index = Session.userChangedCallbacks.indexOf(cb);
        if (index >= 0) {
            Session.userChangedCallbacks.slice(index, 1);
        }
    }

    static isLoggedIn = (): boolean => {
        return Session.currentUser !== null;
    }

    static isAnonymous = (): boolean => {
        if (Session.currentUser !== null) {
            return Session.currentUser.isAnonymous();
        }
        return false;
    }

    static setCurrent = (user: User | null) => {
        Session.currentUser = user;
        Session.callUserChangedCallback(Session.currentUser);
    }

    static updateTokens = (token: string, refreshToken?: string) => {
        Session.token.setToken(token);
        if (refreshToken !== undefined) {
            Session.refreshToken.setToken(refreshToken);
        }
    }

    static logout = async () => {
        let call = await callAPI("oauth/token/" + Session.token.breakDown()?.id, "DELETE", undefined, true);

        if ((call && call.success) || call?.status === 401) {
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

    static checkLogin = async (): Promise<null | User> => {
        let validToken = Session.token.getValidTokenBreakdown();
        if (validToken !== null) {
            let call = await callAPI<DefaultResponse<UserResource>>("api/users/" + validToken.userId, "GET", undefined, true);

            if (call) {
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
        }
        if (Session.refreshToken.exists()) {
            let refreshToken = Session.refreshToken.getToken() as string;

            let formData: FormData = new FormData();
            formData.append("grant_type", "refresh_token");
            formData.append("refresh_token", refreshToken);
            formData.append("client_id", String(process.env.REACT_APP_CLIENT_ID));
            formData.append("client_secret", process.env.REACT_APP_CLIENT_SECRET);
            formData.append("scope", "");

            let call = await callAPI<TokenCreatedResource>("oauth/token", "POST", formData);
            if (call) {
                if (call.success) {
                    let data = call.callData;
                    Session.updateTokens(data.access_token, data.refresh_token);
                    return await Session.checkLogin();
                } else {
                    Session.removeTokens();
                }
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

        let call = await callAPI<TokenCreatedResource>('oauth/token', 'POST', formData);

        if (call && call.success) {
            let data = call.callData;
            Session.updateTokens(data.access_token, (rememberMe) ? data.refresh_token : undefined);
            return await Session.checkLogin();
        }
        return null;
    }

    static loginAnonymous = async (): Promise<null | AnonymousUserResource> => {
        let call = await callAPI('api/users/anonymous', 'POST');
        if (call && call.success) {
            let data = call.callData;
            return data as AnonymousUserResource;
        }
        return null;
    }

    static register = async (email: string, username: string, password: string, captchaKey: string, captcha: string): Promise<CallInterface<object> | null> => {
        return await createUser(username, email, password, captchaKey, captcha);
    }

    private static callUserChangedCallback(user: User | null) {
        for (let cb of this.userChangedCallbacks) {
            cb(user);
        }
    }

}

export {
    Session
}
