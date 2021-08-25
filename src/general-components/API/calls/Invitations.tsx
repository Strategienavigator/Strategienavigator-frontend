import {callAPI} from "../API";

/**
 * Zeigt alle Einladungslinks zum ausgewählten Speicherstand an
 *
 * @param saveID ID des Speicherstandes
 * @param token Der Token zur Authentifizierung
 */
const showInvitationLinks = async (saveID: number, token: string | null) => {
    return await callAPI("api/saves/" + saveID + "/invitation-link", "GET", undefined, (token !== null) ? token : undefined)
}

/**
 * Zeigt die Meta-Daten eines Eindladungslinks an
 *
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param token Der Token zur Authentifizierung
 */
const showInvitationLink = async (invitationToken: string, token: string | null) => {
    return await callAPI("api/invitation-link/" + invitationToken, "GET", undefined, (token !== null) ? token : undefined)
}

export interface createInviteInterface {
    permission: number
    expiry_date: Date
}

/**
 * Erstellt eine neue Invitation
 *
 * @param data Daten der neuen Invitation
 * @param token Der Token zur Authentifizierung
 */
const createInvitationLink = async (data: createInviteInterface, token: string | null) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission))
    apiData.append("expiry_date", String(data.expiry_date));

    return await callAPI("api/invitation-link", "POST", apiData, (token !== null ? token : undefined))
}

/**
 * Aktualisiert/Verändert eine Invitation
 *
 * @param data Daten der Invitation
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param token Der Token zur Authentifizierung
 */
const updateInvitationLink = async (data: createInviteInterface, invitationToken: string, token: string | null) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));
    apiData.append("expiry_date", String(data.expiry_date));

    return await callAPI("api/invitation-link/" + invitationToken, "PUT", apiData, (token !== null ? token : undefined))
}

/**
 * Akzeptiert die Invitation
 *
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param token Der Token zur Authentifizierung
 */
const acceptInvitationLink = async (invitationToken: string | null, token: string | null) => {
    return await callAPI("api/invitation-link/" + invitationToken + "/accept", "PUT", undefined, (token !== null ? token : undefined))
}

export {
    showInvitationLinks,
    showInvitationLink,
    createInvitationLink,
    updateInvitationLink,
    acceptInvitationLink
}