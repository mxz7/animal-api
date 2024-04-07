import { S3_ACCESS_KEY, S3_ENDPOINT, S3_KEY_ID } from "$env/static/private";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: S3_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY,
  },
});

export async function createPresignedUpload(type: string, size: string, id: string) {
  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: "maxzdev-animals",
      Key: id,
      ContentType: type,
      ContentLength: parseInt(size),
    }),
    {
      expiresIn: 300,
    },
  );
}
