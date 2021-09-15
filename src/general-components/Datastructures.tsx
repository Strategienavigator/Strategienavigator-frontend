export type SaveResource = {
    id: number
    owner_id: number
    tool_id: number
    name: string
    data: any
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
    // TODO: Überprüfen was vom Backend geliefert wird
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

export type ToolRescource = {
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
