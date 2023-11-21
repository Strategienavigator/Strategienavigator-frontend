import {APIArgs, callAPI} from "../API";
import {SimpleSaveResource} from "../../Datastructures";


const getSaveResource = async (save: SimpleSaveResource, ressource: number | string, apiArgs?: APIArgs) => {
    return await callAPI<Blob | object>(`api/saves/${save.id}/resources/${ressource}`, "GET", undefined, true, apiArgs);
}

export {
    getSaveResource
}