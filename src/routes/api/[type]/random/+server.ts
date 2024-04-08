import { CDN_URL, URL } from "$env/static/private";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images, requests } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";

export async function GET({ params, fetch }) {
  const res = await fetch(`/api/${params.type.toLowerCase()}/count`);

  if (res.status === 404)
    return json(
      {
        error: 404,
        message: `${params.type.toLowerCase()} not a supported animal type`,
      },
      { status: 404 },
    );

  const { count } = await res.json();

  const [query] = await db
    .select({
      id: images.id,
      name: images.name,
      type: images.type,
      likes: sql`count(${imageLikes.id})`,
      reports: sql`count(${imageReports.id})`,
    })
    .from(images)
    .where(and(eq(images.verified, 1), eq(images.type, params.type.toLowerCase())))
    .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
    .leftJoin(imageReports, eq(images.id, imageReports.imageId))
    .groupBy(images.id)
    .limit(1)
    .offset(Math.floor(Math.random() * count));

  await db
    .insert(requests)
    .values({ type: params.type, createdAt: Date.now() })
    .onConflictDoUpdate({
      set: { served: sql`${requests.served} + 1` },
      target: requests.type,
    });

  return json({
    ...query,
    url: `${URL}/${query.id}`,
    image: `${CDN_URL}/${query.id}`,
  });
}
