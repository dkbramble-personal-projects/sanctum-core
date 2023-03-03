import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { PatchRelease } from '../../../dynamo/releases/service';
import { GetReleaseDate } from '../../../../igdb/service';
import { Release } from '../../../../releases';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;
        if (event.body && id){
            let releaseToUpdate: Release = JSON.parse(event.body);
            releaseToUpdate.id = id;

            if (releaseToUpdate.checkDate && releaseToUpdate.name) {
                var releaseDate = await GetReleaseDate(releaseToUpdate);
                releaseToUpdate.releaseDate = releaseDate ? releaseDate[releaseToUpdate.name] : null;
            }

            await PatchRelease(releaseToUpdate);
    
            return {
                statusCode: StatusCodes.OK,
                body: JSON.stringify({
                    "release": releaseToUpdate
                }),
            };
        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                body: "Body or Id Not Provided",
            };
        }
    } catch(ex : any){
        return {
            statusCode: 500,
            body: "Unable to Create New Release",
        };
    }
}