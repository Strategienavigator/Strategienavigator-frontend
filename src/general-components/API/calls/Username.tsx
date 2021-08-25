import {callAPI} from "../API";

const checkUsername = async (input: string) => {
    let data = new FormData();
    data.append("username", input);

    return await callAPI("api/checkUsername", "POST", data);
}

export {
    checkUsername
}