import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

export async function GET({ setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=3600, stale-while-revalidate" });

  const [query] = await db
    .select({ type: images.type, count: sql`count()` })
    .from(images)
    .groupBy(images.type)
    .where(eq(images.verified, 1));

  return json(query);
}
