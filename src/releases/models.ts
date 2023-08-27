
export interface Release {
    id?: string,
    name?: string;
    type?: string;
    releaseDate?: number | null;
    checkDate?: boolean;
    imageId?: string | null
}

export interface Releases {
    releases: Release[]
}
   