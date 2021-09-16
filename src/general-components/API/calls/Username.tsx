import {callAPI} from "../API";
import {AvailabilityCheckResource, DefaultResponse} from "../../Datastructures";


const checkUsername = async (input: string) => {
    let data = new FormData();
    data.append("username", input);

    return await callAPI<DefaultResponse<AvailabilityCheckResource>>("api/checkUsername", "POST", data);
}

export {
    checkUsername
}
