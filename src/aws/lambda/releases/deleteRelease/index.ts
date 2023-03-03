import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DeleteRelease } from '../../../dynamo/releases/service';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters?.id;
        if (id){
            await DeleteRelease(id);
            return {
                statusCode: StatusCodes.OK,
                body: "Deleted Release " + id,
            };
        } else {
            return {
                statusCode: StatusCodes.BAD_REQUEST,
                body: "No Id Provided",
            };
        }
    } catch(ex : any){
        return {
            statusCode: 500,
            body: "Unable to Delete Release",
        };
    }
}