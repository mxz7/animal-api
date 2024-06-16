import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export async function load({ params, parent }) {
  const { auth } = await parent();

  if (!auth.authenticated) return redirect(302, "/dashboard");

  const query = db
    .select({ id: images.id, type: images.type })
    .from(images)
    .where(
      and(
        eq(images.uploadedBy, auth.user.id),
        eq(images.verified, parseInt(params.verified)),
        eq(images.type, params.type),
      ),
    );

  return { images: query };
}
