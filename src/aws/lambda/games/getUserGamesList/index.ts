import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { GetList } from "../../../../hltb/service"
import { USER_ID } from '../../../../hltb/secrets';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    if (event?.queryStringParameters?.listType) {
        console.log("List Type: " + event?.queryStringParameters?.listType)
        console.log("User ID " + USER_ID)
        try {
            let result = await GetList(USER_ID, [event.queryStringParameters.listType]);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    "games": result
                }),
            };
        } catch (ex: any) {
            return {
                statusCode: 500,
                body: ex.message,
            };
        }
    } else {
        return {
            statusCode: StatusCodes.BAD_REQUEST,
            body: "Must include a proper list type",
        };
    }

};