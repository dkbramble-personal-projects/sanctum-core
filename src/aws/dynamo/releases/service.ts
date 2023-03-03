import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
  ScanCommandInput,
  UpdateCommand,
  UpdateCommandInput
} from "@aws-sdk/lib-dynamodb";
import { Release } from "../../../releases";

const marshallOptions = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
};

const client = new DynamoDBClient({ region: "us-east-1" });
const dynamo = DynamoDBDocumentClient.from(client, {marshallOptions} );
const tableName = "releases";

export const GetRelease = async (entryID: string | undefined): Promise<Release | undefined>  => {
  let body = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: {
        id: entryID,
      },
    })
  );
  var release: Release | undefined = body.Item;
  return release;
}

export const GetReleases = async (filterCheckDate: boolean): Promise<Release[] | undefined>  => {
  
  let body;

  if (filterCheckDate){
    var params: ScanCommandInput = {
      ExpressionAttributeValues: {
        ':b' : true
      },
      FilterExpression: 'checkDate = :b',
      TableName: tableName
    };
    
    body = await dynamo.send(
      new ScanCommand(params)
    );
  } else {
    body = await dynamo.send(
      new ScanCommand({ TableName: tableName })
    );
  }

  var releases: Release[] | undefined = body.Items;
  return releases;
}

export const DeleteRelease = async (entryID: string | undefined): Promise<any>  => {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id: entryID,
      },
    })
  );
  return true;
}


export const PutRelease = async (newRelease: Release): Promise<Release>  => {
  newRelease.id = uuidv4()

  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        id: newRelease.id,
        name: newRelease.name,
        type: newRelease.type,
        releaseDate: newRelease.releaseDate,
        checkDate: newRelease.checkDate
      },
    })
  );

  return newRelease;
}

export const PatchRelease = async (updatedRelease: Release): Promise<Release>  => {
  const params: UpdateCommandInput = {
    TableName: tableName,
    Key: {
      id: updatedRelease.id,
    },
    UpdateExpression: "set #release_name = :n, #release_type = :t, releaseDate = :r, checkDate = :c",
    ExpressionAttributeValues: {
      ":n": updatedRelease.name,
      ":t": updatedRelease.type,
      ":r": updatedRelease.releaseDate,
      ":c": updatedRelease.checkDate
    },
    ExpressionAttributeNames: {
      "#release_name": "name",
      "#release_type": "type"
    }
  };

  await dynamo.send(
    new UpdateCommand(params)
  );

  return updatedRelease;
}

// export const DynamoHandler = async (event: APIGatewayProxyEventV2, context: Context) => {
//   let body;
//   let statusCode = 200;
//   const headers = {
//     "Content-Type": "application/json",
//   };

// //   const cognitoId = context.identity?.cognitoIdentityId

//   try {
//     switch (event.routeKey) {
//       case "DELETE /releases/{id}":
//         body = DeleteRelease(event.pathParameters?.id);
//         break;
//       case "GET /releases/{id}":
//         body = GetRelease(event.pathParameters?.id);
//         break;
//       case "GET /releases":
//         var filterByCheckDate : boolean = event?.queryStringParameters?.filterByCheckDate == "true"
//         body = GetReleases( filterByCheckDate);
//         break;
//       case "PUT /releases":
//         if (event?.body){
//             let newRelease: Release = JSON.parse(event?.body);
//             body = PutRelease(newRelease);
//             break;
//         } else {
//             throw new Error(`No body provied for new release: "${event.routeKey}"`);
//         }
//       case "PATCH /releases/{id}":
//         if (event?.body){
//             let newRelease: Release = JSON.parse(event?.body);
//             body = PutRelease(newRelease);
//             break;
//         } else {
//             throw new Error(`No body provied for updated release: "${event.routeKey}"`);
//         }
//       default:
//         throw new Error(`Unsupported route: "${event.routeKey}"`);
//     }
//   } catch (err: any) {
//     statusCode = 400;
//     body = err.message;
//   } finally {
//     body = JSON.stringify(body);
//   }

//   return {
//     statusCode,
//     body,
//     headers,
//   };
// };
