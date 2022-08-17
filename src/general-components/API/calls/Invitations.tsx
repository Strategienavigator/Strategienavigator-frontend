import {APIArgs, callAPI} from "../API";
import {DefaultResponse, InvitationLinkResource, PaginationResource, SharedSavePermission} from "../../Datastructures";


/**
 * Zeigt alle Einladungslinks zum ausgewählten Speicherstand an
 *
 * @param saveID ID des Speicherstandes
 * @param apiArgs API Argumente
 */
const showInvitationLinks = async (saveID: number, apiArgs?: APIArgs) => {
    return await callAPI<PaginationResource<InvitationLinkResource>>("api/saves/" + saveID + "/invitation-links", "GET", undefined, true, apiArgs);
}

/**
 * Zeigt die Meta-Daten eines Eindladungslinks an
 *
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param apiArgs API Argumente
 */
const showInvitationLink = async (invitationToken: string, apiArgs?: APIArgs) => {
    return await callAPI<DefaultResponse<InvitationLinkResource>>("api/invitation-link/" + invitationToken, "GET", undefined, true, apiArgs);
}

export interface CreateInviteInterface {
    permission: SharedSavePermission
    expiry_date: Date | null
    save_id: number
}

/**
 * Erstellt eine neue Invitation
 *
 * @param data Daten der neuen Invitation
 * @param apiArgs API Argumente
 */
const createInvitationLink = async (data: CreateInviteInterface, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));

    if (data.expiry_date !== null) {
        apiData.append("expiry_date", data.expiry_date.toLocaleDateString());
    }

    apiData.append("save_id", String(data.save_id));

    return await callAPI("api/invitation-link", "POST", apiData, true, apiArgs);
}

/**
 * Aktualisiert/Verändert eine Invitation
 *
 * @param data Daten der Invitation
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param apiArgs API Argumente
 */
const updateInvitationLink = async (data: CreateInviteInterface, invitationToken: string, apiArgs?: APIArgs) => {
    let apiData = new FormData();
    apiData.append("permission", String(data.permission));
    apiData.append("expiry_date", String(data.expiry_date));

    return await callAPI("api/invitation-link/" + invitationToken, "PUT", apiData, true, apiArgs);
}

/**
 * Akzeptiert die Invitation
 *
 * @param invitationToken Token der Invitation (Hex-Code)
 * @param apiArgs API Argumente
 */
const acceptInvitationLink = async (invitationToken: string | null, apiArgs?: APIArgs) => {
    return await callAPI("api/invitation-link/" + invitationToken + "/accept", "PUT", undefined, true, apiArgs);
}

/**
 * Lehnt die Invitation ab und löscht diese aus der Datenbank
 *
 * @param {string | null} invitationToken
 * @param {APIArgs} apiArgs
 * @returns {Promise<CallInterface<object> | null>}
 */
const deleteInvitationLink = async (invitationToken: string | null, apiArgs?: APIArgs) => {
    return await callAPI("api/invitation-link/" + invitationToken, "DELETE", undefined, true, apiArgs);
}

export {
    showInvitationLinks,
    showInvitationLink,
    createInvitationLink,
    updateInvitationLink,
    acceptInvitationLink,
    deleteInvitationLink
}
