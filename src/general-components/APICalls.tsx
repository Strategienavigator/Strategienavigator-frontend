/**
 * Will return all Saves by the given userID and toolID
 */
import {callAPI} from "./API";

const getSaves = async (userID: number, token: string | null) => {
    return await callAPI("api/users/" + userID + "/saves", "GET", undefined, (token !== null) ? token : undefined);
}

export {
    getSaves
}