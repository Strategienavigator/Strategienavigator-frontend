import {APIArgs, callAPI} from "../API";
import {DefaultResponse, PaginationResource, ToolResource} from "../../Datastructures";


/**
 * Holt alle Tools
 *
 * @param apiArgs Normale api Argumente
 */
const getTools = async (apiArgs?: APIArgs) => {
    return await callAPI<PaginationResource<ToolResource>>("api/tools", "GET", undefined, true, apiArgs);
}

/**
 * Holt ein einzelnes Tool basierend auf der angegebenen ID
 *
 * @param toolID Die ID des Tools
 * @param apiArgs Normale api Argumente
 */
const getTool = async (toolID: number, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<ToolResource>>("api/tools/" + toolID, "GET", undefined, true, apiArgs);
}

export {
    getTools,
    getTool
}
