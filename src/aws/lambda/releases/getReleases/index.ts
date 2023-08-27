import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { GetReleases, PatchRelease } from '../../../dynamo/releases/service';
import { GetReleaseDates } from '../../../../igdb/service';
import { Release } from '../../../../releases';

export const handler = async (_event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {

    try {
        let result: Release[] = [];
        let dynamoReleases = await GetReleases(false);
        let dynamoCheckDate = _.groupBy(dynamoReleases, 'type');

        dynamoCheckDate['Game'] = await RefreshReleases(dynamoCheckDate['Game'] ?? []);
        dynamoCheckDate['DLC'] = await RefreshReleases(dynamoCheckDate['DLC'] ?? []);


        result = _.flatMap(dynamoCheckDate)

        return {
            statusCode: StatusCodes.OK,
            body: JSON.stringify({
                "releases": _.sortBy(result, (result => result?.releaseDate))
            }),
        };
    } catch (ex: any) {
        return {
            statusCode: 500,
            body: ex?.message,
        };
    }
}

async function RefreshReleases(releases: Release[]): Promise<Release[]> {
    if (releases && releases.length > 0) {
        let igdbReleases = await GetReleaseDates(releases);

        if (igdbReleases) {
            for (var release of releases) {
                if (release.name && release.checkDate) {
                    var releaseResult = igdbReleases[release.name];

                    if (releaseResult) {
                        if (release.releaseDate != releaseResult.releaseDate || release.imageId != releaseResult.image_id) {
                            release.releaseDate = releaseResult.releaseDate ?? null;
                            release.imageId = releaseResult.image_id ?? null;

                            await PatchRelease(release);
                        }
                    }

                }
            }
        }
    }

    return releases;
}