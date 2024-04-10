import { ISR_TOKEN } from "$env/static/private";
import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";

export const config = {
  isr: {
    expiration: 3600,
    bypassToken: ISR_TOKEN,
  },
};

export async function GET() {
  const query = await db
    .select({ type: images.type, count: sql`count()` })
    .from(images)
    .groupBy(images.type)
    .where(eq(images.verified, 1));

  return json(query);
}
