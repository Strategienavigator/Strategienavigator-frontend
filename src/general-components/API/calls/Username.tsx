import {APIArgs, callAPI} from "../API";
import {AvailabilityCheckResource, DefaultResponse} from "../../Datastructures";


const checkUsername = async (input: string, apiArgs?: APIArgs) => {
    let data = new URLSearchParams();
    data.append("username", input);

    return await callAPI<DefaultResponse<AvailabilityCheckResource>>("api/checkUsername", "GET", data, false, apiArgs);
}

export {
    checkUsername
}
