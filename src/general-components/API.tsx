interface CallInterface {
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
    let callData = await call.json();

    // BUILD RESPONSE
    let response: CallInterface = {
        callData: callData,
        success: (call.status === 200),
        status: call.status,
        response: call
    }

    return response;
}

export {
    callAPI
};
