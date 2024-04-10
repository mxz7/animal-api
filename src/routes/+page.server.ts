import { ISR_TOKEN } from "$env/static/private";
import db from "$lib/server/database/database.js";
import { requests } from "$lib/server/database/schema.js";
import type { Image, Types } from "$lib/types/api.js";
import { asc, sum } from "drizzle-orm";

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
  const cat = fetch(`/api/cat/random`).then((r) => r.json() as Promise<Image>);

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
