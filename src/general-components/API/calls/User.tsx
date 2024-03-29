import {APIArgs, callAPI} from "../API";
import {UserSearchResultResource} from "../../Datastructures";


export type UpdateData = {
    username?: string
    password?: string
    email?: string
    current_password?: string
}
/**
 * Erstellt einen neuen Nutzer in der Datenbank
 * @param username Benutzername des neuen Nutzers
 * @param email Email Adresse des neuen Nutzers
 * @param password Passwort des neuen Nutzers
 * @param captchaKey key des captchas
 * @param captcha die antwort des captchas
 * @param anonymousID id des anonymen Nutzers, wenn er angegeben wird, werden alle Speicherstände und Einstellungen des anonymen Nutzers übernommen
 * @param apiArgs Normale api Argumente
 */
const createUser = async (username: string, email: string, password: string, captchaKey: string, captcha: string, anonymousID?: number, apiArgs?: APIArgs) => {
    let formData = new FormData();

    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("captcha_key", captchaKey);
    formData.append("captcha", captcha);
    if (anonymousID !== undefined)
        formData.append("anonymous_id", anonymousID.toString(10));

    return await callAPI("api/users", "POST", formData, false, apiArgs);
}

/**
 * Bearbeitet den Benutzer mit den übermittelten Daten
 *
 * @param data Die zu übernehmenden Daten
 * @param userID Die ID des Benutzers
 * @param apiArgs Normale api Argumente
 */
const updateUser = async (userID: number, data: UpdateData, apiArgs?: APIArgs) => {
    let formData = new FormData();

    if (data.username !== undefined)
        formData.append("username", data.username);
    if (data.password !== undefined)
        formData.append("password", data.password);
    if (data.current_password !== undefined)
        formData.append("current_password", data.current_password);

    return await callAPI("api/users/" + userID, "PUT", formData, true, apiArgs);
}

/**
 * Portiert einen Benutzeraccount von Anonym auf Normal
 *
 * @param {UpdateData & { captcha: string, captcha_key: string }} data Die Daten des Benutzers
 * @param {APIArgs} apiArgs Die API-Argumente
 * @returns {Promise<CallInterface<object> | null>}
 */
const portUser = async (data: UpdateData & { captcha: string, captcha_key: string }, apiArgs?: APIArgs) => {
    let formData = new FormData();
    if (data.email !== undefined)
        formData.append("email", data.email);
    if (data.username !== undefined)
        formData.append("username", data.username);
    if (data.password !== undefined)
        formData.append("password", data.password);
    if (data.captcha !== undefined)
        formData.append("captcha", data.captcha);
    if (data.captcha_key !== undefined)
        formData.append("captcha_key", data.captcha_key);

    return await callAPI("api/user/port", "POST", formData, true, apiArgs);
}

/**
 * Löscht einen Benutzer
 *
 * @param userID Die ID des Benutzers
 * @param apiArgs Normale api Argumente
 */
const deleteUser = async (userID: number, apiArgs?: APIArgs) => {
    return await callAPI("api/users/" + userID, "DELETE", undefined, true, apiArgs);
}


/**
 * Sucht einen User basierend auf dem angegebenen Searchstring
 *
 * @param {string} searchString Der Suchstring
 * @param {APIArgs} apiArgs
 * @returns {Promise<CallInterface<object> | null>}
 */
const searchUser = async (searchString: string, apiArgs?: APIArgs) => {
    let data = new URLSearchParams("name=" + searchString);
    return await callAPI<{ data: UserSearchResultResource[] }>("api/users/search", "GET", data, true, apiArgs);
}

export {
    createUser,
    updateUser,
    deleteUser,
    searchUser,
    portUser
}
