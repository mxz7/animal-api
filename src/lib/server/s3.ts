import { S3_ACCESS_KEY, S3_ENDPOINT, S3_KEY_ID } from "$env/static/private";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: S3_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY,
  },
});
