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

export interface GameCoverResponse {
    id: number,
    game: number;
    image_id: string;
}

export interface CondensedGameResponse {
    [name: string]: {
        releaseDate: number | null | undefined,
        image_id: string | null | undefined
    }
}
