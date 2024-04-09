import { PUBLIC_CDN_URL, PUBLIC_URL } from "$env/static/public";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images } from "$lib/server/database/schema.js";
import { error, json } from "@sveltejs/kit";
import { and, count, eq } from "drizzle-orm";

export async function GET({ params, setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=43200, stale-while-revalidate" });

  const [image] = await db
    .select({
      id: images.id,
      name: images.name,
      type: images.type,
      likes: count(imageLikes.id),
      reports: count(imageReports.id),
      createdAt: images.createdAt,
    })
    .from(images)
    .where(and(eq(images.verified, 1), eq(images.id, params.id), eq(images.type, params.type)))
    .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
    .leftJoin(imageReports, eq(images.id, imageReports.imageId))
    .groupBy(images.id)
    .limit(1);

  if (!image) return error(404, { message: "Not found" });

  return json({
    ...image,
    url: `${PUBLIC_URL}/${image.type}/${image.id}`,
    image: `${PUBLIC_CDN_URL}/${image.type}/${image.id}`,
  });
}
