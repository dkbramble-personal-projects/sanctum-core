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

        let dynamoCheckDate = _.groupBy(dynamoReleases, 'checkDate');

        let dynamoReleasesToCheck = dynamoCheckDate.true ?? [];

        if (dynamoReleasesToCheck && dynamoReleasesToCheck.length > 0){
            let igdbReleases = await GetReleaseDates(dynamoReleasesToCheck);
    
            if (igdbReleases){
                for (var release of dynamoReleasesToCheck){
                    if (release.name && release.releaseDate != igdbReleases[release.name]) {
                        release.releaseDate = igdbReleases[release.name] ?? null;
    
                        await PatchRelease(release);
                    }
                }
            }
        }

        result = dynamoReleasesToCheck.concat(dynamoCheckDate.false ?? []);

        return {
            statusCode: StatusCodes.OK,
            body: JSON.stringify({
                "releases": _.sortBy(result, 'releaseDate')
            }),
        };
    } catch(ex : any){
        return {
            statusCode: 500,
            body: "Unable to Get New Releases",
        };
    }
}