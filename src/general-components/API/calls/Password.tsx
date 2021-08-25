import {callAPI} from "../API";

/**
 * Zeigt die Meta-Daten eines Password-resets an
 *
 * @param passwordResetToken Token des Password-resets
 */
const showPasswordReset = async (passwordResetToken: string) => {
    return await callAPI("api/password/" + passwordResetToken, "GET");
}

interface ForgotPassword {
    email: string
}

/**
 * Fordert einen passwort-reset eines Benutzers an
 *
 * @param data E-Mail des Benutzers
 */
const forgotPassword = async (data: ForgotPassword) => {
    let apiData = new FormData();
    apiData.append("email", data.email);

    return await callAPI("api/password-reset", "POST", apiData);
};

interface UpdatePassword {
    password: string
}

/**
 * Updated das Passwort des Benutzers
 *
 * @param passwordResetToken Token des Password-resets
 * @param data Das zu ändernde Passwort
 */
const updatePassword = async (passwordResetToken: string, data: UpdatePassword) => {
    let apiData = new FormData();
    apiData.append("password", data.password);

    return await callAPI("api/update-password/" + passwordResetToken, "PUT", apiData);
}

export {
    showPasswordReset,
    forgotPassword,
    updatePassword
}