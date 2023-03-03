import { GetAWSSecret } from "../aws/secrets/service"
import { Release } from "../releases";
import { AuthTokenResponse, CondensedGameResponse, GamesResponse } from "./models";
import _ from 'lodash';
import fetch from "node-fetch";


const secret_name = "dev/IGDB_API_SECRETS";

export const GetReleaseDates = async (releases: Release[]): Promise<CondensedGameResponse | undefined> => {
    let api_secrets = await GetAWSSecret(secret_name);
    const clientID = api_secrets["IGDB_CLIENT_ID"];

    const clientSecret = api_secrets["IGDB_CLIENT_SECRET"];
    
    let authToken = await getIGDBAuthToken(clientID, clientSecret);

    if (authToken){
       var gameReleaseDates = await getIGDBReleaseDates(releases, authToken, clientID);
        return _.chain(gameReleaseDates)
                    .groupBy('name')
                    .map(g => _.maxBy(g, 'first_release_date'))
                    .keyBy('name')
                    .mapValues('first_release_date')
                    .value();
    }
} 

export const GetReleaseDate = async (release: Release): Promise<CondensedGameResponse | undefined> => {
    let api_secrets = await GetAWSSecret(secret_name);
    const clientID = api_secrets["IGDB_CLIENT_ID"];

    const clientSecret = api_secrets["IGDB_CLIENT_SECRET"];
    
    let authToken = await getIGDBAuthToken(clientID, clientSecret);

    if (authToken && release.name){
       var gameReleaseDate = await getIGDBReleaseDates([release], authToken, clientID);
       if (gameReleaseDate && gameReleaseDate.length > 0){
        return _.chain(gameReleaseDate)
                    .groupBy('name')
                    .map(g => _.maxBy(g, 'first_release_date'))
                    .keyBy('name')
                    .mapValues('first_release_date')
                    .value();
       }
    }
} 

const getIGDBAuthToken = async (clientID: string, clientSecret: string): Promise<string | undefined> => {
    var tokenRequestURL = 'https://id.twitch.tv/oauth2/token?client_id=' + clientID + '&client_secret=' + clientSecret + '&grant_type=client_credentials';
    var response = await fetch(tokenRequestURL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
    });

    if (response.ok){
        const res = (await response.json()) as any;
        const auth : AuthTokenResponse = res;
        return auth.access_token;
    } else {
        throw new Error('Failed to get auth token for IGDB');
    }
}

const getIGDBReleaseDates = async (releases: Release[], authToken: string, clientID: string): Promise<GamesResponse[]> => {
    var igdbQuery = "fields name, first_release_date; where name = (";
    for (var release of releases){
        igdbQuery += `\"${release.name}\", `
    }

    igdbQuery = igdbQuery.substring(0, igdbQuery.length - 2) + ");";

    var response = await fetch("https://api.igdb.com/v4/games/", {
        method: 'POST',
        headers: {
          'content-type': 'application/json;',
          'Client-ID': clientID,
          'Authorization': `Bearer ${authToken}`
        },
        body: igdbQuery
    });

    if (response.ok){
        const res = (await response.json()) as any;
        const auth : GamesResponse[] = res;

        return auth;
    } else {
        console.log('Failed to get release dates from IGDB');
        return [];

    }
}