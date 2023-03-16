import {SharedSavePermission} from "./Datastructures";
import {Tools} from "../components/platform/home/Home";


/**
 * Gibt die URL zu einem Speicherstand zurück
 *
 * @param {number} saveID Die ID des Speicherstands
 * @param {number} toolID Die ID des Tools
 * @returns {string} URL zum Speicherstand
 */
const getSaveURL = (saveID: number, toolID: number) => {
    let loc = "/";

    for (const tool of Tools) {
        if (tool.id === toolID) {
            loc = tool.link + "/"
            break;
        }
    }

    if (loc !== "/") {
        loc += saveID;
    }
    return loc;
}

/**
 * Wandelt die SharedSavePermission in einen repräsentativen Text um
 *
 * @param {SharedSavePermission} permission Die Permission
 * @returns {string} Der Text
 */
export const getSharedSavePermissionText = (permission: SharedSavePermission): string => {
    switch (permission) {
        case SharedSavePermission.READ:
            return "Nur Lesen";
        case SharedSavePermission.WRITE:
            return "Lesen & Schreiben";
        case SharedSavePermission.ADMIN:
            return "Admin";
        case SharedSavePermission.OWNER:
            return "Besitzer";
        default:
            return "";
    }
}

/**
 * Wandelt die angegebenen Permissions zu HTML-Options um
 *
 * @param {number} permissions Alle Permissions die umgewandelt werden sollen. Leerlassen um alle umzuwandeln
 * @returns {JSX.Element[]} Array aus HTML-Options
 */
export const getSharedSavePermissionOptions = (...permissions: number[]): JSX.Element[] => {
    if (permissions.length <= 0) {
        permissions = Object.keys(SharedSavePermission).filter((key) => {
            return !isNaN(parseInt(key)) && parseInt(key) !== SharedSavePermission.OWNER;
        }).map(item => parseInt(item));
    }

    return Object.keys(SharedSavePermission).filter((key) => {
        return !isNaN(parseInt(key));
    }).filter((item) => {
        return permissions.includes(parseInt(item));
    }).map((item) => {
        return (
            <option key={"permission-" + item} value={item}>{getSharedSavePermissionText(parseInt(item))}</option>
        );
    });

}

export {
    getSaveURL
}