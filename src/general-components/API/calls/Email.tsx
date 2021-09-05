import {callAPI} from "../API";


/**
 * Verifiziert eine E-Mail-Adresse
 *
 * @param emailToken Token der Invitation (Hex-Code)
 */
const verifyEmail = async (emailToken: string) => {
    return await callAPI("api/email/verify/" + emailToken, "PUT");
}

const checkEmail = async (input: string) => {
    let data = new FormData();
    data.append("email", input);

    return await callAPI("api/checkEmail", "POST", data);
}

export {
    verifyEmail,
    checkEmail
}