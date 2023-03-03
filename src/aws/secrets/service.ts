import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export const GetAWSSecret = async (secretName: string): Promise<Record<string, any>> => {

    const client = new SecretsManagerClient({
        region: "us-east-1",
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT",
            })
        );
    } catch (error) {
        throw error;
    }

    const secret = response.SecretString;

    if (secret){
        return JSON.parse(secret);
    } else {
        throw new Error(`Unable to retrieve secret: ${secretName}`);
    }

}