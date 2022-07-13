/**
 * Repräsentiert einen Speicherstand.
 * Der Typparameter steht für die Daten, da diese von Tool zu Tool unterschiedlich sind
 */
export type SaveResource<D = object> = {
    /**
     * Die ID des Speicherstands
     */
    id: number
    /**
     * Der Benutzername vom Besitzer
     */
    owner: string
    /**
     * Die ID vom Besitzer
     */
    owner_id: number
    /**
     * Die ID des dazugehörigen Tools
     */
    tool_id: number
    /**
     * Die Daten des Speicherstands.
     * Sind vom Typ D (Generic/Typparameter)
     */
    data: D
    /**
     * Der Name des Speicherstands
     */
    name: string
    /**
     * Die Beschreibung des Speicherstands
     */
    description: string
    /**
     * Die ID des Benutzers der aktuell den Speicherstand bearbeitet. Sollte keiner diesen bearbeiten steht hier null
     */
    locked_by: number | null
    /**
     * Der Zeitstempel wann der Speicherstand erstellt wurde
     */
    created_at: string
    /**
     * Der Zeitstempel wann der Speicherstand das letzte mal abgespeichert wurde
     */
    updated_at: string
    /**
     * Der Zeitstempel wann der Speicherstand das letzte mal bearbeitet wurde
     */
    last_locked: string | null
    /**
     * Ein Array aus Benutzer-IDs. Stellen die Benutzer dar, welche am Speicherstand mitarbeiten
     */
    contributors: Array<number>
    /**
     * Ein Array aus Benutzer-IDs. Stellen die Benutzer dar, welche eingeladen wurden am Speicherstand mitzuarbeiten
     */
    invited: Array<number>
}

/**
 * Repräsentiert einen Speicherstand, aber ohne unnötige Informationen, welche so groß sein können, dass eine Schnelle Datenermittlung nicht möglich sein kann (bsp. Data)
 */
export type SimpleSaveResource = {
    /**
     * Die ID des Speicherstands
     */
    id: number
    /**
     * Die ID des Benutzers der aktuell den Speicherstand bearbeitet. Sollte keiner diesen bearbeiten steht hier null
     */
    locked_by: number
    /**
     * Der Name des Speicherstands
     */
    name: string
    /**
     * Der Zeitstempel wann der Speicherstand das letzte mal bearbeitet wurde
     */
    last_locked: Date
    /**
     * Die ID vom Besitzer
     */
    owner_id: number

    /**
     * name des Eigentümers
     */
    owner: string

    /**
     * ob das Konto des Eigentümers gerade gelöscht wird
     */
    owner_deleting: boolean
    /**
     * Die ID des dazugehörigen Tools
     */
    tool_id: number
    /**
     * Die Beschreibung des Speicherstands
     */
    description: string
    /**
     * Ein Array aus Benutzer-IDs. Stellen die Benutzer dar, welche am Speicherstand mitarbeiten
     */
    contributors: Array<number>
}

/**
 * Eine Einladung zu einem Speicherstand
 */
export type InvitationLinkResource = {
    /**
     * Die ID der Einladung
     */
    id: number
    /**
     * Das Datum wann die Einladung ausläuft
     */
    expiry_date: Date
    /**
     * Die Berechtigung die die Person erhält, sollte diese die Einladung akzeptieren.
     * Die Berechtigung wird mittels Integer angegeben
     */
    permission: number
    /**
     * Die ID des Speicherstands, zu dem der Benutzer eingeladen wurde
     */
    save_id: number
    /**
     * Der Token des Einladungslinks
     */
    token: string
    /**
     * Das Datum wann die Einladung erfolgte
     */
    created_at: Date
}

/**
 * Datenressource einer Passwort zurücksetzung
 */
export type PasswordResetResource = {
    /**
     * Die ID des Benutzers, zu dem der Password-reset gehört
     */
    user_id: number
    /**
     * Das Datum, wann der Password-reset ausläuft
     */
    expiry_date: Date
}


/**
 * Sollte eine Abfrage stattfinden, wo eine Pagination eingebunden ist, wird diese hier dargestellt.
 * Der Typparameter D repräsentiert die in der Pagination eingebundende Ressource. Dabei kann es sich z.B. um einen Speicherstand oder Benutzer handeln.
 */
export type PaginationResource<D> = {
    /**
     * Die Daten der Pagination. Enthält alle Ressourcen vom Typ D als Array.
     */
    data: Array<D>
    /**
     * Stellt die Links dar welche angeklickt werden müssen, um sich die erste, letzte, nächste und vorherige Ressource anzeigen zu lassen.
     * Im falle einer API-Abfrage stellen die Links hier die Nächste API-Anfrage dar.
     */
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
    /**
     * Metadaten der Pagination
     */
    meta: {
        current_page: number
        from: number
        last_page: number
        links: Array<{
            url: string | null
            label: string | null
            active: boolean
        }>
        path: string
        per_page: number
        to: number
        total: number
    }
}

export type DefaultResponse<D> = {
    /**
     * Daten
     */
    data: D
}

export type UserResource = {
    /**
     * ID des Benutzers
     */
    id: number
    /**
     * Benutzername
     */
    username: string
    /**
     * Boolean Flag ob es sich um einen Anonymen Benutzer handelt
     */
    anonymous: boolean
    /**
     * E-Mail Adresse des Benutzers
     */
    email: string
    /**
     * Erstelldatum des Benutzerkontos
     */
    created_at: Date
    /**
     * Array mit der IDs der von diesem Benutzer erstellten Speicherstände
     */
    owned_saves: Array<number>
    /**
     * Array mit IDs der mit diesem Benutzer geteilten Speicherstände
     */
    shared_saves: Array<number>
    /**
     * Array mit Einladungen an diesen Benutzer
     */
    invitations: Array<SharedSaveUserResource>
}

export type AnonymousUserResource = {
    /**
     * Benutzername des Anonymen Benutzers
     */
    username: string,
    /**
     * Passwort des Anonymen Benutzers
     */
    password: string
}

export type TokenCreatedResource = {
    /**
     * Type des Tokens, normalerweise "Bearer"
     */
    token_type: string
    /**
     * Zeit in sekunden, nachdem der Token abläuft
     */
    expires_in: number
    /**
     * Der Access Token
     */
    access_token: string
    /**
     * Der Refresh Token
     */
    refresh_token: string
}

export type ToolResource = {
    /**
     * ID des Tools
     */
    id: number
    /**
     * Name des Tools
     */
    name: string
}

export type SharedSaveResource = {
    /**
     * ID in der Datenbank
     */
    id: number
    /**
     * ID des eingeladenen Benutzers
     */
    user: number
    /**
     * ID des geteilten Speicherstandes
     */
    save: number
    /**
     * Die Berechtigung die der eingeladene Benutzer erhält
     */
    permission: number
    /**
     * Boolean ob die Einladung angenommen wurde
     */
    accepted: boolean
    /**
     * Boolean ob die Einladung abgelehnt wurde
     */
    declined: boolean
    /**
     * Boolean ob die Einladung zurückgezogen wurde
     */
    revoked: boolean
}

export type SharedSaveUserResource = {
    /**
     * ID des Speicherstandes
     */
    save_id: number
    /**
     * Berechtigung für den Speicherstand
     */
    permission: number
}

export type AvailabilityCheckResource = {
    /**
     * ob das eingegebene noch verfügbar ist
     */
    available: boolean,

    /**
     * Grund für Verfügbarkeitsstatus
     *
     * string ist leer, wenn verfügbar
     */
    reason: "taken" | "blocked" | "invalid",
}
export type UserSettingResource = {
    /**
     * ID des Benutzers
     */
    user_id: number
    /**
     * ID der Einstellung
     */
    setting_id: number
    /**
     * Wert der Einstellung
     */
    value: string
}

export type SettingResource = {
    /**
     * ID der Einstellung
     */
    id: number
    /**
     * Name der Einstellung
     */
    name: string
    /**
     * Beschreibung der Einstellung
     */
    description: string
    /**
     * Art der Einstellung
     */
    type: string
    /**
     * Sonstige Extrainformationen welche mitgespeichert werden können.
     */
    extras: string
    /**
     * Der Standardwert der Einstellung
     */
    default: string
}
