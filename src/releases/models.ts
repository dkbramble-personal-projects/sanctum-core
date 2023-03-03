
export interface Release {
    id?: string,
    name?: string;
    type?: string;
    releaseDate?: number | null;
    checkDate?: boolean;
}

export interface Releases {
    releases: Release[]
}
   