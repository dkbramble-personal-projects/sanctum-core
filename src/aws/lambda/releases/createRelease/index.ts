import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { PutRelease } from '../../../dynamo/releases/service';
import { GetReleaseDate } from '../../../../igdb/service';
import { Release } from '../../../../releases';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    try {
        if (event.body){
            let releaseToCreate: Release = JSON.parse(event.body);

            if (releaseToCreate.checkDate && releaseToCreate.name) {
                var releaseDate = await GetReleaseDate(releaseToCreate);
                releaseToCreate.releaseDate = releaseDate ? releaseDate[releaseToCreate.name] : null;
            }

            await PutRelease(releaseToCreate);
    
            return {
                statusCode: StatusCodes.OK,
                body: JSON.stringify({
                    "release": releaseToCreate
                }),
            };
        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                body: "No Body Provided",
            };
        }
    } catch(ex : any){
        return {
            statusCode: 500,
            body: "Unable to Create New Release",
        };
    }
}