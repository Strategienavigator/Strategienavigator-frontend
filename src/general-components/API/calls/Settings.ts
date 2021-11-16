import {APIArgs, callAPI} from "../API";
import {DefaultResponse, PaginationResource, SettingResource, UserSettingResource} from "../../Datastructures";


/**
 * Holt sich alle Einstellungen
 *
 * @param page Optional: Seite der Einstellungen
 * @param apiArgs API Argumente
 */
const getSettings = (page?: number, apiArgs?: APIArgs) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (page) {
        data.append("page", String(page));
        searchParams = true;
    }

    return callAPI<PaginationResource<SettingResource>>("api/settings", "GET", searchParams ? data : undefined, true, apiArgs);
}

/**
 * Holt sich eine einzelne Einstellungen des Benutzers
 *
 * @param settingId ID der Einstellung
 * @param apiArgs API Argumente
 */
const getSetting = (settingId: number, apiArgs?: APIArgs) => {
    return callAPI<DefaultResponse<SettingResource>>(`api/settings/${settingId}`, "GET", undefined, true, apiArgs);
}

/**
 * Holt sich alle Einstellungen eines Benutzers
 *
 * @param userId Benutzer-ID
 * @param page Optional: Seite der Einstellungen
 * @param apiArgs API Argumente
 */
const getUserSettings = (userId: number, page?: number, apiArgs?: APIArgs) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (page) {
        data.append("page", String(page));
        searchParams = true;
    }
    return callAPI<PaginationResource<UserSettingResource>>(`api/users/${userId}/settings`, "GET", searchParams ? data : undefined, true, apiArgs);
}

/**
 * Holt sich eine einzelne Benutzereinstellung
 *
 * @param userId Benutzer-ID
 * @param settingId ID der Einstellung
 * @param apiArgs API Argumente
 */
const getUserSetting = (userId: number, settingId: number, apiArgs?: APIArgs) => {
    return callAPI<DefaultResponse<UserSettingResource>>(`api/users/${userId}/settings/${settingId}`, "GET", undefined, true, apiArgs);
}

/**
 * Erstellt eine neue Benutzereinstellung
 *
 * @param userID Benutzer-ID
 * @param settingID ID der Einstellung
 * @param value Wert der Einstellung
 * @param apiArgs API Argumente
 */
const createUserSettings = (userID: number, settingID: number, value: string, apiArgs?: APIArgs) => {
    let data = new FormData();
    data.append("value", value);
    data.append("setting", settingID.toString());
    return callAPI(`api/users/${userID}/settings`, "POST", data, true, apiArgs);
}

/**
 * Aktualisiert eine neue Benutzereinstellung
 *
 * @param userID Benutzer-ID
 * @param settingID ID der Einstellung
 * @param value Wert der Einstellung
 * @param apiArgs API Argumente
 */
const updateUserSettings = (userID: number, settingID: number, value: string, apiArgs?: APIArgs) => {
    let data = new FormData();
    let bodyData = false;
    if (value) {
        bodyData = true;
        data.append("value", value);
    }
    return callAPI(`api/users/${userID}/settings/${settingID}`, "PUT", bodyData ? data : undefined, true, apiArgs);
}

/**
 * Aktualisiert eine neue Benutzereinstellung
 *
 * @param userID Benutzer-ID
 * @param settingID ID der Einstellung
 * @param apiArgs API Argumente
 */
const deleteUserSettings = (userID: number, settingID: number, apiArgs?: APIArgs) => {
    return callAPI(`api/users/${userID}/settings/${settingID}`, "DELETE", undefined, true, apiArgs);
}

export {
    getSettings,
    getSetting,
    getUserSettings,
    getUserSetting,
    createUserSettings,
    updateUserSettings,
    deleteUserSettings
}
