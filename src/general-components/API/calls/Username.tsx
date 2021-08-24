import {callAPI} from "../API";

const checkUsername = async (input: string) => {
    let data = JSON.stringify({
        username: input
    });

    return await callAPI("api/checkUsername", "POST", data);
}

export {
    checkUsername
}