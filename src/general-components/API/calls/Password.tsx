import {APIArgs, callAPI} from "../API";
import {DefaultResponse, PasswordResetResource} from "../../Datastructures";


/**
 * Zeigt die Meta-Daten eines Password-resets an
 *
 * @param passwordResetToken Token des Password-resets
 * @param apiArgs API Argumente
 */
const showPasswordReset = async (passwordResetToken: string, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<PasswordResetResource>>("api/password/" + passwordResetToken, "GET", undefined, false, apiArgs);
}

interface ForgotPassword {
    email: string
}

/**
 * Fordert einen passwort-reset eines Benutzers an
 *
 * @param data E-Mail des Benutzers
 * @param apiArgs API Argumente
 */
const forgotPassword = async (data: ForgotPassword, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("email", data.email);

    return await callAPI("api/password-reset", "POST", apiData, false, apiArgs);
};

interface UpdatePassword {
    password: string
}

/**
 * Updated das Passwort des Benutzers
 *
 * @param passwordResetToken Token des Password-resets
 * @param data Das zu ändernde Passwort
 * @param apiArgs API Argumente
 */
const updatePassword = async (passwordResetToken: string, data: UpdatePassword, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("password", data.password);

    return await callAPI("api/update-password/" + passwordResetToken, "PUT", apiData, true, apiArgs);
}

export {
    showPasswordReset,
    forgotPassword,
    updatePassword
}
