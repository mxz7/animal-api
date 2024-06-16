import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { redirect } from "@sveltejs/kit";
import { count, eq } from "drizzle-orm";

export async function load({ parent }) {
  const { auth } = await parent();

  if (auth.authenticated && auth.user.type === "user") return redirect(302, "/dashboard");

  return {
    categories: await db
      .select({ type: images.type, amount: count() })
      .from(images)
      .where(eq(images.verified, 0))
      .groupBy(images.type),
  };
}
