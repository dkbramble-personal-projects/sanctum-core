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
                var releaseData = await GetReleaseDate(releaseToCreate, releaseToCreate.checkDate);

                if (releaseData && releaseData[releaseToCreate.name]) {
                    releaseToCreate.releaseDate = releaseData[releaseToCreate.name]?.releaseDate;
                    releaseToCreate.imageId = releaseData[releaseToCreate.name].image_id;
                }
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
            body: ex.message,
        };
    }
}