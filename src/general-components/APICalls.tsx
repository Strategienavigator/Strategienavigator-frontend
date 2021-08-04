import {callAPI} from "./API";

/**
 * Will return all Saves by the given userID and toolID
 */
const getSaves = async (userID: number, token: string | null) => {
    return await callAPI("api/users/" + userID + "/saves", "GET", undefined, (token !== null) ? token : undefined);
}

/**
 * Will update the User with the given data and userID
 */
export type updateData = {
    username?: string
    password?: string
    email?: string
    current_password?: string
}
const updateUser = async (userID: number, data: updateData, token: string | null) => {
    let formData = new FormData();

    if (data.username !== undefined)
        formData.append("username", data.username);
    if (data.password !== undefined)
        formData.append("password", data.password);
    if (data.current_password !== undefined)
        formData.append("current_password", data.current_password);

    formData.append("_method", "PUT");

    return await callAPI("api/users/" + userID, "POST", formData, (token !== null) ? token : undefined);
}

/**
 * Will delete the user with the given userID and token
 */
const deleteUser = async (userID: number, token: string | null) => {
    return await callAPI("api/users/" + userID, "DELETE", undefined, (token !== null) ? token : undefined);
}

export {
    getSaves,
    updateUser,
    deleteUser
}