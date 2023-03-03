import { Context, APIGatewayProxyResult, APIGatewayProxyEventV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { GetList } from "../../../../hltb/service"
import { GetAWSSecret } from '../../../secrets/service';

const secret_name = 'dev/HLTB_USER_SECRETS';

export const handler = async (event: APIGatewayProxyEventV2, _context: Context): Promise<APIGatewayProxyResult> => {
    if (event?.queryStringParameters?.listType){
        let api_secrets = await GetAWSSecret(secret_name);
        const userId: number = api_secrets["USER_ID"];

        try{
            let result = await GetList(userId, [event.queryStringParameters.listType]);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    "games": result
                }),
             };
        } catch(ex : any){
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