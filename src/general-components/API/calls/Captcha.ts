import {APIArgs, callAPI} from "../API";
import {CaptchaResponse} from "../../Datastructures";


/**
 * Lädt ein neues Captcha
 *
 * @param apiArgs Normale api Argumente
 */
const getCaptcha = (apiArgs?: APIArgs) => {
    return callAPI<CaptchaResponse>("captcha/api", "GET", undefined, false, apiArgs);
}


export {
    getCaptcha
}
