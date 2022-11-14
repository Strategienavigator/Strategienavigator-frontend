import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {Session} from "./general-components/Session/Session";


declare global {
    interface Window {
        Pusher: Pusher,
        Echo: Echo
    }
}

window.Pusher = require('pusher-js');

export const createSocketConnection = (token?: string): Echo => {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_COLLABORATION_KEY,
        wsHost: process.env.REACT_APP_COLLABORATION_URL,
        wsPort: process.env.REACT_APP_COLLABORATION_PORT,
        forceTLS: false,
        disableStats: true,
        // AUTH
        auth: {
            headers: {
                Authorization: `Bearer ${token ?? Session.getToken()}`
            }
        },
        authEndpoint: `${process.env.REACT_APP_API}api/broadcasting/auth`,
    });
    window.Echo.registerInterceptors();
    return window.Echo;
}
