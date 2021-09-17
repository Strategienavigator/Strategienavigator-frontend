import {callAPI} from "../API";


/**
 * Holt sich alle Saves zum angegebenen Benutzer
 *
 * @param userID Die ID des Benutzers
 * @param token Der Token zur Authentifizierung
 * @param toolID ID des Strategietools
 * @param page Nummer der Seite, startet bei 1
 * @param name Name als Suchparameter
 * @param description Beschreibung als Suchparameter
 * @param searchBoth Ob in dem Speicherstand der Suchwert von dem Namen und der Beschreibung enthalten sein muss oder nur eins der beiden
 */
const getSaves = async (userID: number, token: string | null, toolID?: number, page?: number, name?: string, description?: string, searchBoth?: boolean) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (toolID) {
        data.append("tool_id", String(toolID));
        searchParams = true;
    }
    if (page) {
        data.append("page", String(page));
        searchParams = true;
    }
    if (name) {
        data.append("name", name);
        searchParams = true;
    }
    if (description) {
        data.append("description", description);
        searchParams = true;
    }

    if (searchBoth) {
        data.append("search_both", searchBoth ? "1" : "0");
        searchParams = true;
    }

    return await callAPI("api/users/" + userID + "/saves", "GET", searchParams ? data : undefined, (token !== null) ? token : undefined);
}

/**
 * Holt sich einen einzelnen Save über die ID
 *
 * @param saveID Die ID des Saves
 * @param token Der Token zur Authentifizierung
 */
const getSave = async (saveID: number, token: string | null) => {
    return await callAPI("api/saves/" + saveID, "GET", undefined, (token !== null) ? token : undefined);
}

/**
 * Löscht den Save mit der angegebenen ID
 *
 * @param saveID Die ID des Speicherstandes
 * @param token Der Token zur Authentifizierung
 */
const deleteSaves = async (saveID: number, token: string | null) => {
    return await callAPI("api/saves/" + saveID, "DELETE", undefined, (token !== null) ? token : undefined);
}

/**
 * Updatet einen Save
 *
 * @param saveID Die ID des Saves
 * @param token Der Token zur Authentifizierung
 * @param data Daten des Speicherstandes
 */
const updateSave = async (saveID: number, data: FormData, token: string | null) => {
    data.append("_method", "PUT");

    return await callAPI("api/saves/" + saveID, "POST", data, (token !== null) ? token : undefined);
}

/**
 * Erstellt einen neuen Save
 *
 * @param data Daten des Save
 * @param token Der Token zur Authentifizierung
 */
const createSave = async (data: FormData, token: string | null) => {
    return await callAPI("api/saves", "POST", data, (token !== null) ? token : undefined);
}

export {
    getSaves,
    getSave,
    deleteSaves,
    updateSave,
    createSave
}
