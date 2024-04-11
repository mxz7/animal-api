import { ISR_TOKEN } from "$env/static/private";
import { PUBLIC_CDN_URL, PUBLIC_URL } from "$env/static/public";
import db from "$lib/server/database/database.js";
import { imageLikes, imageReports, images, requests } from "$lib/server/database/schema.js";
import type { Types } from "$lib/types/api.js";
import { and, asc, count, eq, sum } from "drizzle-orm";

export const config = {
  isr: {
    expiration: 43200,
    bypassToken: ISR_TOKEN,
  },
};

export async function load({ request, fetch }) {
  const served = db
    .select({ total: sum(requests.served) })
    .from(requests)
    .limit(1)
    .then((r) => parseInt(r[0].total ?? "0"));

  const since = db
    .select({ date: requests.createdAt })
    .from(requests)
    .orderBy(asc(requests.createdAt))
    .limit(1)
    .then((r) => r[0]?.date ?? 0);

  const categories = fetch("/api/types").then((r) => r.json() as Promise<Types>);
  const cat = (async () => {
    const [{ amount }] = await db
      .select({ amount: count(images.id) })
      .from(images)
      .where(eq(images.type, "cat"));

    const [query] = await db
      .select({
        id: images.id,
        name: images.name,
        type: images.type,
        likes: count(imageLikes.id),
        reports: count(imageReports.id),
      })
      .from(images)
      .where(and(eq(images.verified, 1), eq(images.type, "cat")))
      .leftJoin(imageLikes, eq(images.id, imageLikes.imageId))
      .leftJoin(imageReports, eq(images.id, imageReports.imageId))
      .groupBy(images.id)
      .limit(1)
      .offset(Math.floor(Math.random() * amount));

    return {
      ...query,
      url: `${PUBLIC_URL}/${query.type}/${query.id}`,
      image: `${PUBLIC_CDN_URL}/${query.type}/${query.id}`,
    };
  })(); // api would go serverless -> edge -> serverless which vercel doesnt like

  if (request.headers.get("user-agent")?.toLowerCase().includes("bot")) {
    return {
      served: await served,
      since: await since,
      categories: await categories,
      image: await cat,
    };
  }

  return { served, since, categories: categories, image: cat };
}
