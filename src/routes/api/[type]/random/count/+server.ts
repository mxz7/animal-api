import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { json } from "@sveltejs/kit";
import { and, eq, sql } from "drizzle-orm";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "s-maxage=7200, stale-while-revalidate" });

  const [{ count }] = await db
    .select({ count: sql`count(*)` })
    .from(images)
    .where(and(eq(images.type, params.type.toLowerCase()), eq(images.verified, 1)));

  if (!count)
    return json(
      {
        error: 404,
        message: `${params.type.toLowerCase()} not a supported animal type`,
      },
      { status: 404 },
    );

  return json({ count, type: params.type.toLowerCase() });
}
