import db from "$lib/server/database/database.js";
import { images } from "$lib/server/database/schema.js";
import { redirect } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";

export async function load({ params, parent }) {
  const { auth } = await parent();

  if (!auth.authenticated) return redirect(302, "/dashboard");

  const query = db
    .select({ id: images.id, type: images.type, name: images.name, createdAt: images.createdAt })
    .from(images)
    .where(
      and(
        eq(images.uploadedBy, auth.user.id),
        eq(images.verified, parseInt(params.verified)),
        eq(images.type, params.type),
      ),
    )
    .orderBy(desc(images.createdAt));

  return { images: query };
}
