import {callAPI} from "../API";
import {AvailabilityCheckResource, DefaultResponse} from "../../Datastructures";


/**
 * Verifiziert eine E-Mail-Adresse
 *
 * @param emailToken Token der Invitation (Hex-Code)
 */
const verifyEmail = async (emailToken: string) => {
    return await callAPI("api/email/verify/" + emailToken, "PUT");
}

const checkEmail = async (input: string) => {
    let data = new URLSearchParams();
    data.append("email", input);

    return await callAPI<DefaultResponse<AvailabilityCheckResource>>("api/checkEmail", "GET", data);
}

export {
    verifyEmail,
    checkEmail
}
