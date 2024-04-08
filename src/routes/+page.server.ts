import db from "$lib/server/database/database.js";
import { requests } from "$lib/server/database/schema.js";
import { asc, sum } from "drizzle-orm";

export async function load({ setHeaders, request }) {
  setHeaders({ "cache-control": "s-maxage=43200, stale-while-revalidate" });

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

  if (request.headers.get("user-agent")?.toLowerCase().includes("bot")) {
    return {
      served: await served,
      since: await since,
    };
  }

  return { served, since };
}
