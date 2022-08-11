import {APIArgs, callAPI} from "../API";
import {DefaultResponse, SharedSaveResource} from "../../Datastructures";


/**
 * Zeigt alle an einem Speicherstand beteiligten Personen an
 *
 * @param saveID ID des Saves
 * @param apiArgs API Argumente
 */
const getContributors = async (saveID: number, apiArgs?: APIArgs) => {
    return await callAPI<{data: SharedSaveResource[]}>("api/saves/" + saveID + "/contributors", "GET", undefined, true, apiArgs)
}

/**
 * Zeigt alle aktuellen Kollaborationen eines Users an
 *
 * @param userID ID des Users
 * @param apiArgs API Argumente
 */
const showContributions = async (userID: number, apiArgs?: APIArgs) => {
    return await callAPI<{data: SharedSaveResource[]}>("api/users/" + userID + "/contributions", "GET", undefined, true, apiArgs);
}

/**
 * Zeigt die Contribution an
 *
 * @param contributionID
 * @param apiArgs API Argumente
 */
const showContribution = async (contributionID: number, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<SharedSaveResource>>("api/contribution/" + contributionID, "GET", undefined, true, apiArgs);
}

interface CreateContribution {
    permission: number
}

/**
 * Erstellt eine neue Einladung für den gegebenen Save und gegebenen User
 *
 * @param saveID ID des Saves
 * @param userID ID des Users
 * @param data Daten der neuen Contributionv
 * @param apiArgs API Argumente
 */
const createContribution = async (saveID: number, userID: number, data: CreateContribution, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));

    return await callAPI("api/saves/" + saveID + "/contributors/" + userID, "POST", apiData, true, apiArgs);
}

interface UpdateContribution {
    permission: number
    revoked: boolean
}

/**
 * Updated die Contribution
 *
 * @param contributionID ID der Contribution
 * @param data Daten der Contribution
 * @param apiArgs API Argumente
 */
const updateContribution = async (contributionID: number, data: UpdateContribution, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));
    apiData.append("revoked", String(data.revoked));

    return await callAPI("api/contribution/" + contributionID, "PUT", apiData, true, apiArgs)
}

/**
 * Akzeptiert eine Contribution
 *
 * @param contributionID ID der Contribution
 * @param apiArgs API Argumente
 */
const acceptContribution = async (contributionID: number, apiArgs?: APIArgs) => {
    return await callAPI("api/contribution/" + contributionID + "/accept", "PUT", undefined, true, apiArgs);
}

/**
 * Lehnt eine Contribution ab
 *
 * @param contributionID ID der Contribution
 * @param apiArgs API Argumente
 */
const declineContribution = async (contributionID: number, apiArgs?: APIArgs) => {
    return await callAPI("api/contribution/" + contributionID + "/decline", "PUT", undefined, true, apiArgs);
}

/**
 * Löscht eine Contribution
 *
 * @param contributionID ID der Contribution
 * @param apiArgs API Argumente
 */
const deleteContribution = async (contributionID: number, apiArgs?: APIArgs) => {
    return await callAPI("api/contribution/" + contributionID, "DELETE", undefined, true, apiArgs);
}


export {
    getContributors,
    showContributions,
    showContribution,
    createContribution,
    updateContribution,
    acceptContribution,
    declineContribution,
    deleteContribution
}
