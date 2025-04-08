import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

const client = new DynamoDBClient({
    region: AWS_REGION!,
});

export const dynamodb = DynamoDBDocumentClient.from(client);
