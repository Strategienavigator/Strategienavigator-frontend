import {APIArgs, callAPI} from "../API";
import {DefaultResponse, PaginationResource, SaveResource, SimpleSaveResource} from "../../Datastructures";


export interface GetSavesArguments {
    /**
     * ID des Strategietools
     */
    toolID?: number,
    /**
     * Nummer der Seite, startet bei 1
     */
    page?: number,
    /**
     * Name als Suchparameter
     */
    name?: string,
    /**
     * Beschreibung als Suchparameter
     */
    description?: string,
    /**
     * Ob in dem Speicherstand der Suchwert von dem Namen und der Beschreibung enthalten sein muss oder nur eins der beiden
     */
    searchBoth?: boolean,
    /**
     * Ob die speicherstände absteigend oder aufsteigend nach erstelldatum sortiert werden sollen
     */
    orderDesc?: boolean
}

/**
 * Holt sich alle Saves zum angegebenen Benutzer
 *
 * @param userID Die ID des Benutzers
 * @param getSavesArguments Argumente welche steuern, welche werte zurückgegeben werden
 * @param apiArgs API Argumente
 */
const getSaves = async (userID: number, getSavesArguments: GetSavesArguments, apiArgs?: APIArgs) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (getSavesArguments.toolID) {
        data.append("tool_id", String(getSavesArguments.toolID));
        searchParams = true;
    }
    if (getSavesArguments.page) {
        data.append("page", String(getSavesArguments.page));
        searchParams = true;
    }
    if (getSavesArguments.name) {
        data.append("name", getSavesArguments.name);
        searchParams = true;
    }
    if (getSavesArguments.description) {
        data.append("description", getSavesArguments.description);
        searchParams = true;
    }

    if (getSavesArguments.searchBoth) {
        data.append("search_both", getSavesArguments.searchBoth ? "1" : "0");
        searchParams = true;
    }

    if (getSavesArguments.orderDesc !== undefined ) {
        data.append("orderBy", getSavesArguments.orderDesc ? "DESC" : "ASC");
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
const deleteSave = async (saveID: number, apiArgs?: APIArgs) => {
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
const createSave = async <D extends unknown>(data: FormData, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<SaveResource<D>>>("api/saves", "POST", data, true, apiArgs);
}

export {
    getSaves,
    getSave,
    deleteSave,
    updateSave,
    lockSave,
    createSave
}
