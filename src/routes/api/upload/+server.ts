import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { s3 } from "$lib/server/s3.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { error, json } from "@sveltejs/kit";
import dayjs from "dayjs";
import { and, count, eq, gt, or } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST({ locals, getClientAddress }) {
  const auth = await locals.validate();

  if (!auth) return error(401);

  const [{ rowCount }] = await db
    .select({ rowCount: count() })
    .from(images)
    .where(
      and(
        or(eq(images.uploadedBy, auth.user.id), eq(images.uploadedIp, getClientAddress())),
        gt(images.createdAt, dayjs().subtract(1, "day").toDate().getTime()),
      ),
    );

  if (rowCount > 200) return error(429);

  const key = nanoid();

  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: "maxzdev-animals", Key: key }),
    {
      expiresIn: 300,
    },
  );

  await db.insert(images).values({
    id: key,
    uploadedBy: auth.user.id,
    uploadedIp: getClientAddress(),
    createdAt: Date.now(),
    type: "null",
    verified: 0,
  });

  return json({ url, key });
}
