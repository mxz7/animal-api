import db from "$lib/server/database/database.js";
import { requests } from "$lib/server/database/schema.js";
import { asc, sum } from "drizzle-orm";

export async function load({ setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=3600, stale-while-revalidate" });

  return {
    served: await db
      .select({ total: sum(requests.served) })
      .from(requests)
      .limit(1)
      .then((r) => r[0].total ?? 0),
    since: await db
      .select({ date: requests.createdAt })
      .from(requests)
      .orderBy(asc(requests.createdAt))
      .limit(1)
      .then((r) => r[0]?.date ?? 0),
  };
}
