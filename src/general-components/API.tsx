export interface CallInterface {
    callData: any
    success: boolean
    status: number
    response: Response
}

declare type Methods = "GET" | "POST" | "DELETE" | "PUT";

const callAPI = async (URL: string, method: Methods, data?: FormData | Blob | string, token?: string) => {
    let callURL = process.env.REACT_APP_API + URL;

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
    // TODO: change here if other than json responses are needed
    try {
        callData = JSON.parse(body);
    } catch (e) {
        callData = body;
    }

    // BUILD RESPONSE
    let response: CallInterface = {
        callData: callData,
        success: (call.status >= 200 && call.status < 300),
        status: call.status,
        response: call
    }

    return response;
}

export {
    callAPI
};
