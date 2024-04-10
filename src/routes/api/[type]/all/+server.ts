import { ISR_TOKEN } from "$env/static/private";
import { PUBLIC_CDN_URL, PUBLIC_URL } from "$env/static/public";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images, requests } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { and, count, eq, sql } from "drizzle-orm";

export const config = {
  isr: {
    expiration: 3600,
    bypassToken: ISR_TOKEN,
  },
};

export async function GET({ params }) {
  const query = await db
    .select({
      id: images.id,
      type: images.type,
      name: images.name,
      likes: count(imageLikes.id),
      reports: count(imageReports.id),
    })
    .from(images)
    .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
    .leftJoin(imageReports, eq(images.id, imageReports.imageId))
    .groupBy(images.id)
    .where(and(eq(images.type, params.type.toLowerCase()), eq(images.verified, 1)));

  if (query.length === 0)
    return json({ error: 404, message: `${params.type.toLowerCase()} unsuppoed animal type` });

  await db
    .insert(requests)
    .values({ type: params.type, createdAt: Date.now() })
    .onConflictDoUpdate({
      set: { served: sql`${requests.served} + 1` },
      target: requests.type,
    });

  return json(
    query.map((i) => ({
      ...i,
      url: `${PUBLIC_URL}/${i.type}/${i.id}`,
      image: `${PUBLIC_CDN_URL}/${i.type}/${i.id}`,
    })),
  );
}
