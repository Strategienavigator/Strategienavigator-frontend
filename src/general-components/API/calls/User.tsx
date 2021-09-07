import {callAPI} from "../API";


export type updateData = {
    username?: string
    password?: string
    email?: string
    current_password?: string
}
/**
 * Bearbeitet den Benutzer mit den übermittelten Daten
 *
 * @param data Die zu übernehmenden Daten
 * @param userID Die ID des Benutzers
 * @param token Der Token zur Authentifizierung
 */
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
 * Löscht einen Benutzer
 *
 * @param userID Die ID des Benutzers
 * @param token Der Token zur Authentifizierung
 */
const deleteUser = async (userID: number, token: string | null) => {
    return await callAPI("api/users/" + userID, "DELETE", undefined, (token !== null) ? token : undefined);
}

export {
    updateUser,
    deleteUser
}