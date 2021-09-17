import {showErrorPage} from "../../index";

export interface CallInterface<D> {
    callData: D
    success: boolean
    status: number
    response: Response
}

/**
 * Alle API Übermittlungsmethoden
 */
declare type Methods = "GET" | "POST" | "DELETE" | "PUT";

/**
 * Führt eine HTTP-Request auf der genannten URL aus.
 * Hierzu kann auch ein Token übergeben werden, der zur Authentifizierung im Header platziert wird.
 *
 * @param URL URL zur Backend-Route/ ohne slash am Anfang
 * @param method API Übermittlungsmethode
 * @param data Inhalt des Requests
 * @param token Authentifizierungstoken
 */
const callAPI = async <D extends object>(URL: string, method: Methods, data?: FormData | Blob | URLSearchParams, token?: string) => {
    try {
        let callURL = process.env.REACT_APP_API + URL;

        // METHOD
        if (data?.constructor.name === "FormData" && method === "PUT") {
            (data as FormData).append("_method", "PUT");
            method = "POST";
        }
        if (data?.constructor.name === "URLSearchParams") {
            callURL = callURL.concat("?" + (data as URLSearchParams).toString());
            data = undefined;
        }

        // HEADER
        let headers: HeadersInit = new Headers();
        headers.append("Accept", "application/json");

        // TOKEN
        if (token !== undefined) {
            headers.append("Authorization", "Bearer " + token);
        }

        // REQUEST-INIT
        let requestInit: RequestInit = {
            method: method,
            headers: headers,
            body: data,
            mode: "cors"
        }

        // CALL THE API
        let call = await fetch(callURL, requestInit);
        let body = await call.text();

        // check if body json, else put raw response
        let callData;
        try {
            callData = JSON.parse(body);
        } catch (e) {
            callData = body;
        }

        // BUILD RESPONSE
        let response: CallInterface<D> = {
            callData: callData,
            success: (call.status >= 200 && call.status < 300),
            status: call.status,
            response: call
        }

        return response;
    } catch (e) {
        showErrorPage(500);

        // BUILD EMPTY RESPONSE
        let emptyResponse: CallInterface<object> = {
            callData: {},
            success: false,
            status: 500,
            response: new Response()
        }
        return emptyResponse;
    }
}

export {
    callAPI
};
