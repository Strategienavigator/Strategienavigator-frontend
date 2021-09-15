import {callAPI} from "../API";
import {DefaultResponse, PaginationResource, ToolResource} from "../../Datastructures";


/**
 * Holt alle Tools
 *
 * @param token Der Token zur Authentifizierung
 */
const getTools = async (token: string | null) => {
    return await callAPI<PaginationResource<ToolResource>>("api/tools", "GET", undefined, (token !== null) ? token : undefined);
}

/**
 * Holt ein einzelnes Tool basierend auf der angegebenen ID
 *
 * @param toolID Die ID des Tools
 * @param token Der Token zur Authentifizierung
 */
const getTool = async (toolID: number, token: string | null) => {
    return await callAPI<DefaultResponse<ToolResource>>("api/tools/" + toolID, "GET", undefined, (token !== null) ? token : undefined);
}

export {
    getTools,
    getTool
}
