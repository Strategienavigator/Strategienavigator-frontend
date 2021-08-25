import {callAPI} from "../API";

/**
 * Zeigt alle an einem Speicherstand beteiligten Personen an
 *
 * @param saveID ID des Saves
 * @param token Der Token zur Authentifizierung
 */
const getContributors = async (saveID: number, token: string | null) => {
    return await callAPI("api/saves/" + saveID + "/contributors", "GET", undefined, (token !== null ? token : undefined))
}

/**
 * Zeigt alle aktuellen Kollaborationen eines Users an
 *
 * @param userID ID des Users
 * @param token Der Token zur Authentifizierung
 */
const showContributions = async (userID: number, token: string | null) => {
    return await callAPI("api/users/" + userID + "/constributions", "GET", undefined, (token !== null ? token : undefined));
}

/**
 * Zeigt die Contribution an
 *
 * @param contributionID
 * @param token
 */
const showContribution = async (contributionID: number, token: string | null) => {
    return await callAPI("api/contribution/" + contributionID, "GET", undefined, (token !== null ? token : undefined))
}

interface CreateContribution {
    permission: number
}

/**
 * Erstellt eine neue Einladung für den gegebenen Save und gegebenen User
 *
 * @param saveID ID des Saves
 * @param userID ID des Users
 * @param data Daten der neuen Contribution
 * @param token Der Token zur Authentifizierung
 */
const createContribution = async (saveID: number, userID: number, data: CreateContribution, token: string | null) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));

    return await callAPI("api/saves/" + saveID + "/contributors/" + userID, "POST", apiData, (token !== null ? token : undefined));
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
 * @param token Der Token zur Authentifizierung
 */
const updateContribution = async (contributionID: number, data: UpdateContribution, token: string | null) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));
    apiData.append("revoked", String(data.revoked));

    return await callAPI("api/contribution/" + contributionID, "PUT", apiData, (token !== null ? token : undefined))
}

/**
 * Akzeptiert eine Contribution
 *
 * @param contributionID ID der Contribution
 * @param token Der Token zur Authentifizierung
 */
const acceptContribution = async (contributionID: number, token: string | null) => {
    return await callAPI("api/contribution/" + contributionID + "/accept", "PUT", undefined, (token !== null ? token : undefined));
}

/**
 * Lehnt eine Contribution ab
 *
 * @param contributionID ID der Contribution
 * @param token Der Token zur Authentifizierung
 */
const declineContribution = async (contributionID: number, token: string | null) => {
    return await callAPI("api/contribution/" + contributionID + "/decline", "PUT", undefined, (token !== null ? token : undefined));
}

/**
 * Löscht eine Contribution
 *
 * @param contributionID ID der Contribution
 * @param token Der Token zur Authentifizierung
 */
const deleteContribution = async (contributionID: number, token: string | null) => {
    return await callAPI("api/contribution/" + contributionID, "DELETE", undefined, (token !== null ? token : undefined));
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