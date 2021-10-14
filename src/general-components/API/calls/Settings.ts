import {callAPI} from "../API";
import {DefaultResponse, PaginationResource, SettingResource, UserSettingResource} from "../../Datastructures";


const getSettings = (token: string, page?: number) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (page) {
        data.append("page", String(page));
        searchParams = true;
    }


    return callAPI<PaginationResource<SettingResource>>("api/settings", "GET", searchParams ? data : undefined, token);
}

const getSetting = (token: string, settingId: number) => {
    return callAPI<DefaultResponse<SettingResource>>(`api/settings/${settingId}`, "GET", undefined, token);
}


const getUserSettings = (userId: number, token: string, page?: number) => {
    let data = new URLSearchParams();
    let searchParams = false;

    if (page) {
        data.append("page", String(page));
        searchParams = true;
    }
    return callAPI<PaginationResource<UserSettingResource>>(`api/users/${userId}/settings`, "GET", searchParams ? data : undefined, token);
}

const getUserSetting = (userId: number, settingId: number, token: string) => {
    return callAPI<DefaultResponse<UserSettingResource>>(`api/users/${userId}/settings/${settingId}`, "GET", undefined, token);
}

const createUserSettings = (userID: number, setttingID: number, token: string, value: string) => {
    let data = new FormData();
    data.append("value", value);
    data.append("setting", setttingID.toString());
    return callAPI(`api/users/${userID}/settings`, "POST", data, token);
}

const updateUserSettings = (userID: number, setttingID: number, token: string, value: string) => {
    let data = new FormData();
    let bodyData = false;
    if (value) {
        bodyData = true;
        data.append("value", value);
    }
    return callAPI(`api/users/${userID}/settings/${setttingID}`, "PUT", bodyData ? data : undefined, token);
}

const deleteUserSettings = (userID: number, settingID: number, token: string) => {
    return callAPI(`api/users/${userID}/settings/${settingID}`, "DELETE", undefined, token);
}

export {
    getSettings,
    getSetting,
    getUserSettings,
    getUserSetting,
    createUserSettings,
    updateUserSettings,
    deleteUserSettings
}
