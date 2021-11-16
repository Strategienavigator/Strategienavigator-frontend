import {APIArgs, callAPI} from "../API";
import {DefaultResponse, PaginationResource, SaveResource, SimpleSaveResource} from "../../Datastructures";


/**
 * Holt sich alle Saves zum angegebenen Benutzer
 *
 * @param userID Die ID des Benutzers
 * @param toolID ID des Strategietools
 * @param page Nummer der Seite, startet bei 1
 * @param name Name als Suchparameter
 * @param description Beschreibung als Suchparameter
 * @param searchBoth Ob in dem Speicherstand der Suchwert von dem Namen und der Beschreibung enthalten sein muss oder nur eins der beiden
 * @param apiArgs API Argumente
 */
const getSaves = async (userID: number, toolID?: number, page?: number, name?: string, description?: string, searchBoth?: boolean, apiArgs?: APIArgs) => {
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

    return await callAPI<PaginationResource<SimpleSaveResource>>("api/users/" + userID + "/saves", "GET", searchParams ? data : undefined, true, apiArgs);
}

/**
 * Holt sich einen einzelnen Save über die ID
 *
 * @param saveID Die ID des Saves
 * @param apiArgs API Argumente
 */
const getSave = async (saveID: number, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<SaveResource>>("api/saves/" + saveID, "GET", undefined, true, apiArgs);
}

/**
 * Löscht den Save mit der angegebenen ID
 *
 * @param saveID Die ID des Speicherstandes
 * @param apiArgs API Argumente
 */
const deleteSaves = async (saveID: number, apiArgs?: APIArgs) => {
    return await callAPI("api/saves/" + saveID, "DELETE", undefined, true, apiArgs);
}

/**
 * Updatet einen Save
 *
 * @param saveID Die ID des Saves
 * @param data Daten des Speicherstandes
 * @param apiArgs API Argumente
 */
const updateSave = async (saveID: number, data: FormData, apiArgs?: APIArgs) => {
    data.append("_method", "PUT");

    return await callAPI("api/saves/" + saveID, "POST", data, true, apiArgs);
}

/**
 * Lockt einen Save
 *
 * @param {number} saveID
 * @param {boolean} lock
 * @param apiArgs API Argumente
 * @returns {Promise<CallInterface<object> | null>}
 */
const lockSave = async (saveID: number, lock: boolean, apiArgs?: APIArgs) => {
    let data = new FormData();
    data.append("_method", "PUT");

    let locking = String(lock ? 1 : 0);
    data.append("lock", locking);

    return await callAPI("api/saves/" + saveID, "POST", data, true, apiArgs);
}

/**
 * Erstellt einen neuen Save
 *
 * @param data Daten des Save
 * @param apiArgs API Argumente
 */
const createSave = async (data: FormData, apiArgs?: APIArgs) => {
    return await callAPI("api/saves", "POST", data, true, apiArgs);
}

export {
    getSaves,
    getSave,
    deleteSaves,
    updateSave,
    lockSave,
    createSave
}
