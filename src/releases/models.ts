
export interface Release {
    title?: string;
    type?: string;
    releaseDate?: number;
    checkDate?: number;
}

export interface Releases {
    releases: Release[]
}
   