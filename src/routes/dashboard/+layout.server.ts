import db from "$lib/server/database/database.js";
import { imageReports } from "$lib/server/database/schema.js";
import { error, redirect } from "@sveltejs/kit";
import { count } from "drizzle-orm";

export const config = {
  runtime: "edge",
};

export async function load({ locals, url }) {
  const auth = await locals.validate(false);

  if (!auth) return redirect(302, `/login?next=${encodeURIComponent(url.pathname)}`);

  if (auth.user.banned) return error(402);

  return {
    user: auth.user,
    reportCount: db
      .select({ reports: count(imageReports.id) })
      .from(imageReports)
      .then((r) => r[0]?.reports || 0),
  };
}
