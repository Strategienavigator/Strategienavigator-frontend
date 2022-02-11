import {APIArgs, callAPI} from "../API";
import {AvailabilityCheckResource, DefaultResponse} from "../../Datastructures";


/**
 * Verifiziert eine E-Mail-Adresse
 *
 * @param emailToken Token der Invitation (Hex-Code)
 * @param apiArgs API Argumente
 */
const verifyEmail = async (emailToken: string, apiArgs?: APIArgs) => {
    return await callAPI("api/email/verify/" + emailToken, "PUT", undefined, false, apiArgs);
}

/**
 * Prüft die Verfügbarkeit der E-Mail
 *
 * @param input Die E-Mail
 * @param apiArgs API Argumente
 */
const checkEmail = async (input: string, apiArgs?: APIArgs) => {
    let data = new URLSearchParams();
    data.append("email", input);

    return await callAPI<DefaultResponse<AvailabilityCheckResource>>("api/checkEmail", "GET", data, false, apiArgs);
}

export {
    verifyEmail,
    checkEmail
}
