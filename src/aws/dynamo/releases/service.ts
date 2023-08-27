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
        checkDate: newRelease.checkDate,
        imageId: newRelease.imageId
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
    UpdateExpression: "set #release_name = :n, #release_type = :t, releaseDate = :r, checkDate = :c, #image_id = :d",
    ExpressionAttributeValues: {
      ":n": updatedRelease.name,
      ":t": updatedRelease.type,
      ":r": updatedRelease.releaseDate,
      ":c": updatedRelease.checkDate,
      ":d": updatedRelease.imageId
    },
    ExpressionAttributeNames: {
      "#release_name": "name",
      "#release_type": "type",
      "#image_id": "imageId"
    }
  };

  await dynamo.send(
    new UpdateCommand(params)
  );

  return updatedRelease;
}
