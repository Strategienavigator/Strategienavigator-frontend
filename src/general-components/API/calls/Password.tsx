import {callAPI} from "../API";

const showPasswordReset = async () => {

}

const forgotPassword = async () => {
    return await callAPI("api/password-reset", "POST", undefined)
}

interface UpdatePassword {
    password: string
}

/**
 *
 * @param passwordResetToken
 * @param data
 * @param token
 */
const updatePassword = async (passwordResetToken: string, data: UpdatePassword, token: string | null) => {
    let apiData = JSON.stringify(data);

    return await callAPI("api/password-reset/" + passwordResetToken, "POST", apiData, (token !== null) ? token : undefined);
}

export {
    showPasswordReset,
    forgotPassword,
    updatePassword
}