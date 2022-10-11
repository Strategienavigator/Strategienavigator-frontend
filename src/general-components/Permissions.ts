import {SharedSavePermission} from "./Datastructures";


export type Permissions = SharedSavePermission[];

/**
 * Gibt zurück ob sich die angegebene Permission in den angegeben Permissions befindet
 *
 * @param {SharedSavePermission} userPermission Die zu prüfende Permission
 * @param {Permissions} permissions Die Vergleichspermissions
 * @returns {boolean}
 */
export const hasPermission = (userPermission: SharedSavePermission, permissions: Permissions) => {
    return permissions.includes(userPermission);
}

const OWNER_ADMIN_PERMISSIONS = [
    SharedSavePermission.ADMIN,
    SharedSavePermission.OWNER
];

//
//
//
// Permissions
//
//      |
//      |
//      ᐯ
//
//
//

/**
 * Gibt an welcher Benutzer einen Speicherstand zurücksetzen darf
 *
 * @type {Permissions}
 */
export const ResetSavePermission: Permissions = OWNER_ADMIN_PERMISSIONS;

/**
 * Gibt an welcher Benutzer einen Speicherstand abspeichern darf
 *
 * @type {Permissions}
 */
export const SaveSavePermission: Permissions = [
    ...OWNER_ADMIN_PERMISSIONS,
    SharedSavePermission.WRITE
];

/**
 * Gibt an welcher Benutzer daten in einem Speicherstand verändern darf.
 * Ist dies Berechtigung nicht gesetzt, dann kann der Benutzer die Daten nicht verändern!
 *
 * @type {Permissions}
 */
export const EditSavesPermission: Permissions = [
    ...OWNER_ADMIN_PERMISSIONS,
    SharedSavePermission.WRITE
];

/**
 * Gibt an welcher Benutzer einen Speicherstand löschen darf
 * (Gilt auch für geteilte Speicherstände)
 *
 * @type {Permissions}
 */
export const DeleteSavePermission: Permissions = [
    SharedSavePermission.OWNER,
];

/**
 * Gibt an welcher Benutzer einen Speicherstand teilen darf
 *
 * @type {Permissions}
 */
export const InviteToSavePermission: Permissions = OWNER_ADMIN_PERMISSIONS;