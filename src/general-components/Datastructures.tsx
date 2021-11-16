export type SaveResource<D = object> = {
    id: number
    owner_id: number
    tool_id: number
    data: D
    name: string
    description: string
    locked_by: number | null
    last_locked: string | null
    contributors: Array<number>
    invited: Array<number>
}

export type InvitationLinkResource = {
    id: number
    expiry_date: Date
    permission: number
    save_id: number
    created_at: Date
}

export type PasswordResetResource = {
    user_id: number
    expiry_date: Date
}

export type SimpleSaveResource = {
    id: number
    locked_by: number
    name: string
    last_locked: Date
    owner_id: number
    tool_id: number
    description: string
    contributors: Array<number>
}


export type PaginationResource<D> = {
    data: Array<D>
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
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
    data: D
}

export type UserResource = {
    id: number
    username: string
    anonymous: boolean
    email: string
    created_at: Date
    owned_saves: Array<number>
    shared_saves: Array<number>
    invitations: Array<SharedSaveUserResource>
}

export type AnonymousUserResource = {
    username: string,
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
    id: number
    name: string
}

export type SharedSaveResource = {
    id: number
    user: number
    save: number
    permission: number
    accepted: boolean
    declined: boolean
    revoked: boolean
}

export type SharedSaveUserResource = {
    save_id: number
    permission: number
}

export type AvailabilityCheckResource = {
    available: boolean
}
export type UserSettingResource = {
    user_id: number
    setting_id: number
    value: string
}

export type SettingResource = {
    id: number
    name: string
    description: string
    type: string
    extras: string
    default: string
}