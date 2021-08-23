import {callAPI} from "../API";

/**
 * Verifiziert eine E-Mail-Adresse
 *
 * @param emailToken Token der Invitation (Hex-Code)
 */
const verifyEmail = async (emailToken: string) => {
    return await callAPI("api/email/verify/" + emailToken, "PUT");
}

export {
    verifyEmail
}