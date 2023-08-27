import { Release } from "../releases";
import { AuthTokenResponse, CondensedGameResponse, GameCoverResponse, GamesResponse } from "./models";
import _ from 'lodash';
import fetch from "node-fetch";
import { IGDB_CLIENT_ID, IGDB_CLIENT_SECRET } from "./secrets";

export const GetReleaseDates = async (releases: Release[]): Promise<CondensedGameResponse | undefined> => {

    let authToken = await getIGDBAuthToken(IGDB_CLIENT_ID, IGDB_CLIENT_SECRET);

    if (authToken) {
        var gameReleaseDates = await getIGDBReleaseDates(releases, authToken, IGDB_CLIENT_ID);
        var idList = _.map(gameReleaseDates, 'id');
        var gamesWithoutReleasesSort = _.groupBy(gameReleaseDates, (response) => _.isNil(response.first_release_date));
        var gamesWithoutReleases = gamesWithoutReleasesSort.true;

        var gameReleaseCovers = await getIGDBReleaseCovers(idList, authToken, IGDB_CLIENT_ID);

        var coversCondensed = _.chain(gameReleaseCovers)
            .keyBy('game')
            .mapValues('image_id')
            .value();

        var condensedReleaseDates = _.chain(gameReleaseDates)
            .groupBy('name')
            .map(g => _.maxBy(g, 'first_release_date'))
            .value();

        var response: CondensedGameResponse = {};

        for (var conRelease of condensedReleaseDates.concat(gamesWithoutReleases)) {
            if (conRelease?.name && conRelease?.id) {
                response[conRelease.name] = {
                    releaseDate: conRelease?.first_release_date,
                    image_id: coversCondensed[conRelease.id]
                }
            }
        }

        return response
    }
}

export const GetReleaseDate = async (release: Release, checkDate: boolean): Promise<CondensedGameResponse | undefined> => {
    let authToken = await getIGDBAuthToken(IGDB_CLIENT_ID, IGDB_CLIENT_SECRET);


    if (authToken && release.name) {
        console.log("Auth Token Found for IGDB, beginning request for release dates")
        var gameReleaseDate = await getIGDBReleaseDates([release], authToken, IGDB_CLIENT_ID);
        if (gameReleaseDate && gameReleaseDate.length > 0) {

            var gameWithoutRelease = _.find(gameReleaseDate, (response) => _.isNil(response.first_release_date));

            var condensedReleaseDates: (GamesResponse | undefined)[] = [];
            if (gameWithoutRelease) {
                condensedReleaseDates.push(gameWithoutRelease)
            } else {
                condensedReleaseDates = _.chain(gameReleaseDate)
                    .groupBy('name')
                    .map(g => _.maxBy(g, 'first_release_date'))
                    .value();
            }

            var gameReleaseCovers: GameCoverResponse[] = [];
            if (condensedReleaseDates[0]) {
                gameReleaseCovers = await getIGDBReleaseCovers([condensedReleaseDates[0].id], authToken, IGDB_CLIENT_ID);
            }

            var coversCondensed = _.chain(gameReleaseCovers ?? [])
                .keyBy('game')
                .mapValues('image_id')
                .value();

            var response: CondensedGameResponse = {};

            for (var conRelease of condensedReleaseDates) {
                if (conRelease?.name && conRelease?.id) {
                    response[conRelease.name] = {
                        releaseDate: conRelease?.first_release_date,
                        image_id: coversCondensed[conRelease.id]
                    }
                }
            }

            return response;
        }
    } else {
        console.error("Unable to create auth token for IGDB")
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

    if (response.ok) {
        const res = (await response.json()) as any;
        const auth: AuthTokenResponse = res;
        return auth.access_token;
    } else {
        console.log(response)
        throw new Error('Failed to get auth token for IGDB');
    }
}

const getIGDBReleaseDates = async (releases: Release[], authToken: string, clientID: string): Promise<GamesResponse[]> => {
    var auth: GamesResponse[] = [];

    var chunkedReleases = _.chunk(releases, 10);

    for (const queryReleases of chunkedReleases) {
        var igdbQuery = "fields name, first_release_date; where name = (";

        for (var release of queryReleases) {
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

        if (response.ok) {
            const res = (await response.json()) as any;
            auth = auth.concat(res);

        } else {
            console.log('Failed to get release dates from IGDB');
            return [];
        }
    }


    return auth;
}


const getIGDBReleaseCovers = async (ids: number[], authToken: string, clientID: string): Promise<GameCoverResponse[]> => {
    var chunkedIds = _.chunk(ids, 10);
    var auth: GameCoverResponse[] = [];

    for (const queryIds of chunkedIds) {
        var igdbQuery = "fields game, image_id; where game = (";
        for (var id of queryIds) {
            igdbQuery += id + ", "
        }

        igdbQuery = igdbQuery.substring(0, igdbQuery.length - 2) + ");";

        var response = await fetch("https://api.igdb.com/v4/covers/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json;',
                'Client-ID': clientID,
                'Authorization': `Bearer ${authToken}`
            },
            body: igdbQuery
        });

        if (response.ok) {
            const res = (await response.json()) as any;
            auth = auth.concat(res);
        } else {
            console.log('Failed to get release covers from IGDB');
            return [];

        }
    }

    return auth;
}