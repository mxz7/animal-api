import db from "$lib/server/database/database.js";
import { requests } from "$lib/server/database/schema.js";
import type { Types } from "$lib/types/api.js";
import { asc, sum } from "drizzle-orm";

export async function load({ setHeaders, request, fetch }) {
  setHeaders({ "cache-control": "s-maxage=43200, stale-while-revalidate, max-age=600" });

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

  const categories = fetch("/api/types");

  if (request.headers.get("user-agent")?.toLowerCase().includes("bot")) {
    return {
      served: await served,
      since: await since,
      categories: await categories.then((r) => r.json() as Promise<Types>),
    };
  }

  return { served, since, categories: categories.then((r) => r.json() as Promise<Types>) };
}
