export interface AuthTokenResponse {
    access_token: string,
    expires_in: number,
    token_type: string
}

export interface GamesResponse {
    id: number,
    first_release_date: number,
    name: string
}

export interface CondensedGameResponse {
    [name: string]: number
}