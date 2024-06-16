import db from "$lib/server/database/database.js";
import { imageReports, images } from "$lib/server/database/schema.js";
import { error, redirect } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";

export const config = {
  runtime: "edge",
};

export async function load({ locals, url }) {
  const auth = await locals.validate(false);

  if (!auth.authenticated) return redirect(302, `/login?next=${encodeURIComponent(url.pathname)}`);

  if (auth.user.banned) return error(402);

  if (auth.user.type === "admin" || auth.user.type === "mod") {
    return {
      auth,
      reviewCount: db
        .select({ reviews: count(images.id) })
        .from(images)
        .where(eq(images.verified, 0))
        .then((r) => r[0]?.reviews || 0),
      reportCount: db
        .select({ reports: count(imageReports.id) })
        .from(imageReports)
        .then((r) => r[0]?.reports || 0),
    };
  } else {
    return { auth };
  }
}
